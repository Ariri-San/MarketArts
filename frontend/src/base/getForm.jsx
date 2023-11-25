import Form from "./form.jsx";
import option from "../services/optionService.js";
import { toast } from "react-toastify";


class GetForm extends Form {
    componentDidMount() {
        this.setData();
    }


    setCustomeData(data, newData) {
        if (newData) {
            for (const item of newData) {
                data = this.updateNestedValue(data, item.key, item.object);
            }
        }
        return data;
    }


    async setData() {
        try {
            var data = await option.getOptions(this.props.urlForm, this.props.id);
            this.setState({ optionsData: this.setCustomeData(data, this.props.optionsData) });
        }
        catch (error) {
            return console.log(error);
        }
        if (!data && this.props.id) {
            this.props.navigate(this.props.location.pathname.replace(`/${this.props.id}`, ""));
            toast.error(`ID ${this.props.id} Not Found`);
        }

        this.schema = this.setCustomeData(option.getSchema(data, this.schema), this.props.schema);
        this.setState({ data: await option.setData(data, this.props.id, this.props.urlForm, this.props.data) });
    }


    formData(item) {
        // console.log(item, this.state.data);

        if (item.type === "select") {
            return this.renderSelect(item.name, item.label, this.state.optionsData[item.name].choices);
        }
        else if (item.type === "textarea") {
            return this.renderTextArea(item.name, item.label);
        }
        else if (item.type === "nested object") {
            const data = [];
            for (const item_2 in item["children"]) {
                data.push(this.formData(item["children"][item_2]));
            }
            return data;
        }
        else {
            return this.renderInput(item.name, item.label, item.type);
        }
    }


    getFormData(label) {
        const options = [];
        for (const name in this.state.optionsData) {
            options.push(this.state.optionsData[name]);
        }
        return (
            <form onSubmit={this.handleSubmit}>
                {options.map(item => this.formData(item))}
                {this.renderButton(label, this.buttonDisabled)}
            </form>
        );
    }

}

export default GetForm;