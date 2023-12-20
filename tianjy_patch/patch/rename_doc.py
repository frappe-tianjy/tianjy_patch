import frappe
from frappe.model.utils import is_virtual_doctype
from frappe.model import rename_doc
#update_link_field_values = frappe.model.rename_doc.update_link_field_values

def ex_update_link_field_values(link_fields: list[dict], old: str, new: str, doctype: str) -> None:
    for field in link_fields:
        if field["issingle"]:
            try:
                single_doc = frappe.get_doc(field["parent"])
                if single_doc.get(field["fieldname"]) == old:
                    single_doc.set(field["fieldname"], new)
                    # update single docs using ORM rather then query
                    # as single docs also sometimes sets defaults!
                    single_doc.flags.ignore_mandatory = True
                    single_doc.save(ignore_permissions=True)
            except ImportError:
                # fails in patches where the doctype has been renamed
                # or no longer exists
                pass
        else:
            parent = field["parent"]
            docfield = field["fieldname"]

            # Handles the case where one of the link fields belongs to
            # the DocType being renamed.
            # Here this field could have the current DocType as its value too.

            # In this case while updating link field value, the field's parent
            # or the current DocType table name hasn't been renamed yet,
            # so consider it's old name.
            if parent == new and doctype == "DocType":
                parent = old

            # 虚拟表不存在数据库表，因此不更新数据库链接字段值
            if is_virtual_doctype(field["parent"]) and doctype != "DocType":
                return
            frappe.db.set_value(parent, {docfield: old}, docfield, new, update_modified=False)

        # update cached link_fields as per new
        if doctype == "DocType" and field["parent"] == old:
            field["parent"] = new


rename_doc.update_link_field_values = ex_update_link_field_values
