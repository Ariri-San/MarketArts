import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";
import TextArea from "./textArea";

class Form extends Component {
    state = {
        data: {},
        errors: {},
    };


    updateNestedValue(obj, keys, newValue) {
        var obj_2 = obj;

        for (let index = 0; index < keys.length - 1; index++) {
            obj_2 = obj_2[keys[index]];
        }

        obj_2[keys[keys.length - 1]] = newValue;

        return obj;
    }


    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);
        if (!error) return null;

        const errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        return errors;
    };

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value };
        const array = name.split(".");
        var schema = this.schema;
        for (let index = 0; index < array.length; index++) {
            schema = schema[array[index]];
        }

        schema = { [name]: schema };
        const { error } = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleSubmit = e => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        var data = { ...this.state.data };
        for (const input of e.target) {
            if (input.type === "file") {
                data = this.updateNestedValue(data, input.name.split("."), input.files[0]);
            }
        }

        this.doSubmit(data);
    };

    handleChange = ({ currentTarget: input }) => {
        var value = input.value;
        if (input.type === "checkbox") value = input.checked;

        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        var data = { ...this.state.data };
        data = this.updateNestedValue(data, input.name.split("."), value);

        this.setState({ data, errors });
    };

    renderButton(label, disabled = false, className = "btn btn-primary") {
        return (
            <button disabled={this.validate() || disabled} className={className}>
                {label}
            </button>
        );
    }

    renderSelect(name, label, options) {
        const { data, errors } = this.state;

        return (
            <Select
                key={name}
                name={name}
                value={data[name]}
                label={label}
                options={options}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }

    renderInput(name, label, type = "text") {
        const { data, errors } = this.state;

        return (
            <Input
                key={name}
                type={type}
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }

    renderTextArea(name, label) {
        const { data, errors } = this.state;

        return (
            <TextArea
                key={name}
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }


}



export default Form;
