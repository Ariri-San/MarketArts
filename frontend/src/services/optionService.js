import Joi from "joi-browser";
import { toast } from "react-toastify";
import request from "./requestService";
import getData from "./getData";

function translateType(item, name) {
    item["default"] = "";

    if (
        item.type === "integer" ||
        item.type === "decimal" ||
        item.type === "float" ||
        item.type === "number"
    ) {
        item.type = "number";
    } else if (item.type === "file upload" || item.type === "image upload") {
        item.type = "file";
        item.default = null;
    } else if (item.type === "boolean") {
        item.type = "checkbox";
        item.default = false;
    } else if (name === "password") {
        item.type = name;
    } else if (item.type === "string") {
        if (!item.max_length) {
            item.type = "textarea";
        }
        item.type = "text";
    } else if (item.type === "datetime") {
        item.type = "datetime-local";
    } else if (item.type === "choice") {
        item.type = "select";
    }

    return [item.type, item.default];
}

function checkNested(form, results = null) {
    const data = {};

    for (const name in form) {
        if (form[name]["type"] === "nested object") {
            data[name] = checkNested(form[name]["children"], results);
        } else if (form[name]["type"] === "file") {
            data[name] = form[name].default;
        } else {
            if (results)
                data[name] = results[name] ? results[name] : form[name].default;
            else data[name] = form[name].default;
        }
    }

    return data;
}

function setOptions(form, add_name = "") {
    const data = {};

    for (const name in form) {
        if (
            form[name]["type"] === "nested object" &&
            !form[name]["read_only"]
        ) {
            data[name] = {
                ...form[name],
                children: setOptions(form[name]["children"], name),
                name: add_name ? add_name + "." + name : name,
            };
        } else if (!form[name]["read_only"]) {
            const translatedData = translateType(form[name], name);
            data[name] = {
                ...form[name],
                type: translatedData[0],
                default: translatedData[1],
                label: form[name]["label"],
                name: add_name ? add_name + "." + name : name,
            };
        }
    }

    return data;
}

async function getOptions(url, id = null) {
    var results = {};

    try {
        results = await request.getOptions(url, id);
    } catch (error) {
        toast.error(error);
        return null;
    }

    if (!results.data.actions) return null;
    const form = id ? results.data.actions.PUT : results.data.actions.POST;

    const data = setOptions(form);

    return data;
}

function getSchema(data, schemaData = {}) {
    for (const name in data) {
        if (!schemaData[name]) {
            var required = data[name]["required"];
            var max = data[name]["max_length"];
            var label = data[name]["label"];
            var type = data[name]["type"];

            var schema = Joi;

            if (type === "text" || type === "password" || type === "select") {
                schema = schema.string();
                if (max) {
                    schema = schema.max(max);
                }
            } else if (type === "number") {
                schema = schema.number();
            } else if (type === "email") {
                schema = schema.string().email();
            } else {
                schema = schema.any();
            }

            if (required) {
                schema = schema.required();
            } else {
                schema = schema.empty("");
            }

            schema = schema.label(label);
            // console.log(name, schema);
            if (type === "nested object") {
                schemaData[name] = getSchema(data[name]["children"]);
            } else schemaData[name] = schema;
        }
    }
    // console.log(schemaData);
    return schemaData;
}

async function setData(form, id, url, data = null) {
    var results = data;

    if (id && !data) {
        results = await getData(url, id);
    }
    // console.log(form, results, checkNested(form, results));

    return checkNested(form, results);
}

const functions = {
    setData,
    getOptions,
    getSchema,
};

export default functions;
