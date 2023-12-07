# Copyright (c) 2022, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import mimetypes
import os
from urllib.parse import quote

from werkzeug.exceptions import NotFound
from werkzeug.wrappers import Response
from werkzeug.wsgi import wrap_file

import frappe
import frappe.utils
from frappe import _
import frappe.utils.response

def as_csv():
	response = Response()
	response.mimetype = "text/csv"
	filename = f"{frappe.response['doctype']}.csv"
	response.headers.add("Content-Disposition", "attachment", filename=quote(filename))
	response.data = frappe.response["result"]
	return response


def as_txt():
	response = Response()
	response.mimetype = "text"
	filename = f"{frappe.response['doctype']}.txt"
	response.headers.add("Content-Disposition", "attachment", filename=quote(filename))
	response.data = frappe.response["result"]
	return response


def as_raw():
	response = Response()
	response.mimetype = (
		frappe.response.get("content_type")
		or mimetypes.guess_type(frappe.response["filename"])[0]
		or "application/unknown"
	)
	response.headers.add(
		"Content-Disposition",
		frappe.response.get("display_content_as", "attachment"),
		filename=quote(frappe.response["filename"]),
	)
	response.data = frappe.response["filecontent"]
	return response



def as_pdf():
	response = Response()
	response.mimetype = "application/pdf"
	response.headers.add("Content-Disposition", None, filename=quote(frappe.response["filename"]))
	response.data = frappe.response["filecontent"]
	return response


def as_binary():
	response = Response()
	response.mimetype = "application/octet-stream"
	response.headers.add("Content-Disposition", None, filename=quote(frappe.response["filename"]))
	response.data = frappe.response["filecontent"]
	return response


def send_private_file(path: str) -> Response:
	path = os.path.join(frappe.local.conf.get("private_path", "private"), path.strip("/"))
	filename = os.path.basename(path)

	if frappe.local.request.headers.get("X-Use-X-Accel-Redirect"):
		path = "/protected/" + path
		response = Response()
		response.headers["X-Accel-Redirect"] = quote(frappe.utils.encode(path))

	else:
		filepath = frappe.utils.get_site_path(path)
		try:
			f = open(filepath, "rb")
		except OSError:
			raise NotFound

		response = Response(wrap_file(frappe.local.request.environ, f), direct_passthrough=True)

	# no need for content disposition and force download. let browser handle its opening.
	# Except for those that can be injected with scripts.

	extension = os.path.splitext(path)[1]
	blacklist = [".svg", ".html", ".htm", ".xml"]

	if extension.lower() in blacklist:
		response.headers.add("Content-Disposition", "attachment", filename=quote(filename))

	response.mimetype = mimetypes.guess_type(filename)[0] or "application/octet-stream"

	return response


frappe.utils.response.as_csv = as_csv
frappe.utils.response.as_txt = as_txt
frappe.utils.response.as_raw = as_raw
frappe.utils.response.as_pdf = as_pdf
frappe.utils.response.as_binary = as_binary
frappe.utils.response.send_private_file = send_private_file
