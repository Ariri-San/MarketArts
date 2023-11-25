import GetForm from "./getForm.jsx";
import { toast } from "react-toastify";
import request from "../services/requestService.js";


class FormDjango extends GetForm {

    state = {
        data: {},
        errors: {},
        optionsData: {},
        buttonDisabled: false,
    };

    schema = {};


    setFormData(data, formData, addKey = "") {
        for (const key in data) {
            // console.log(key, data[key]);

            if (typeof data[key] === "object" && data[key]) {
                if (Object.keys(data[key]).length > 0) {
                    this.setFormData(data[key], formData, addKey + key + ".");
                }
                else if (data[key]) formData.append(addKey + key, data[key]);  // this is file
            }
            else if (data[key]) formData.append(addKey + key, data[key]);   // this is string

        }

        return formData;
    }


    addErrors(error) {
        if (Array.isArray(error))
            return {
                "key": Object.keys(error)[0],
                "value": error
            };
        for (const key in error) {
            if (Object.hasOwnProperty.call(error, key)) {
                if (Array.isArray(error[key]))
                    return {
                        "key": Object.keys(error)[0],
                        "value": error[key]
                    };
                if (Object.keys(error[key])) {
                    const error_2 = this.addErrors(error[key]);
                    return {
                        "key": Object.keys(error)[0] + "." + error_2["key"],
                        "value": error_2["value"]
                    };
                }
            }
        }
        return error;
    }


    doSubmit = async (data) => {
        if (this.props.onSubmit) {
            return this.props.onSubmit(this.state);
        }

        try {
            const response = request.saveObject(this.setFormData(data, new FormData()), this.props.urlForm, this.props.id);

            this.buttonDisabled = true;
            const results = await response;

            toast.promise(
                response.then(() => new Promise(resolve => setTimeout(resolve, 300))),
                {
                    pending: 'Loading...',
                    success: { render: `${results.data.id ? `Id: ${results.data.id}, ` : ""}message: ${results.statusText}`, autoClose: 1500 },
                    error: `${results.statusText} 🤯`
                }
            );

            // console.log(results);

            await new Promise(resolve => setTimeout(resolve, 2000))
            this.buttonDisabled = false;
            if (this.props.onResults) {
                this.props.onResults(data, results);
            }

            return this.props.navigate(this.props.toPath);

        } catch (error) {
            const errorData = this.addErrors(error.response.data), newError = {};
            if (errorData["key"] === "0") toast.error(errorData["value"][0]);
            else newError[errorData["key"]] = errorData["value"];
            this.setState({ errors: newError });

            // console.log(error);
            toast.error(error.response.statusText);

            await new Promise(resolve => setTimeout(resolve, 500))
            this.buttonDisabled = false;
            this.props.navigate();
        }
    };


    // props = {
    //     buttonName,
    //     urlForm,
    //     id,
    //     onResults(data, results),
    //     onSubmit(this.state),
    //     data,
    //     optionsData,   // optionsData={[{object: "text", key: ["username", "type"]}]}
    //     schema,   // schema={[{ object: Joi.string().label("Password").required().min(8), key: ['user', 'password'] }]}
    //     navigate,
    //     location,
    //     label,
    // }


    render() {
        if (Object.keys(this.state.data).length)
            return (
                <>
                    {this.props.label && <h1>{this.props.label}</h1>}
                    {this.getFormData(this.props.buttonName ? this.props.buttonName : "Submit")}
                </>
            );
    }
}

export default FormDjango;