import re
import frappe
from frappe import _, safe_decode
from frappe.core.doctype.file.utils import get_random_filename
import frappe.core.doctype.file.utils
from frappe.utils.file_manager import safe_b64decode
from frappe.utils.image import optimize_image


def extract_images_from_html(doc: "Document", content: str, is_private: bool = False):
    frappe.flags.has_dataurl = False

    def _save_file(match):
        data = match.group(2).split("data:")[1]
        headers, content = data.split(",")
        mtype = headers.split(";", 1)[0]

        if isinstance(content, str):
            content = content.encode("utf-8")
        if b"," in content:
            content = content.split(b",")[1]
        content = safe_b64decode(content)

        content = optimize_image(content, mtype)

        if "filename=" in headers:
            filename = headers.split("filename=")[-1]
            filename = safe_decode(filename).split(";", 1)[0]

        else:
            filename = get_random_filename(content_type=mtype)

        if doc.meta.istable:
            doctype = doc.parenttype
            name = doc.parent
        else:
            doctype = doc.doctype
            name = doc.name

        _file = frappe.get_doc(
            {
                "doctype": "File",
                "file_name": filename,
                "attached_to_doctype": doctype,
                "attached_to_name": name,
                "content": content,
                "decode": False,
                "is_private": is_private,
            }
        )
        _file.save(ignore_permissions=True)
        file_url = _file.file_url
        frappe.flags.has_dataurl = True

        return f'<img{match.group(1)}src="{file_url}"'

    if content and isinstance(content, str):
        content = re.sub(
            r'<img([^>]*)src\s*=\s*["\'](?=data:)(.*?)["\']', _save_file, content)

    return content


frappe.core.doctype.file.utils.extract_images_from_html = extract_images_from_html
