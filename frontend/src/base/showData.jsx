import { toast } from "react-toastify";
// import request from "../services/requestService";
import React, { Component } from "react";
import getData from '../services/getData';


class ShowData extends Component {
    state = {
        data: null,
    }

    async componentDidMount() {
        await this.getData();
    }


    setData(data, data_2, addKey = "") {
        for (const key in data) {
            if (typeof data[key] === "object" && data[key]) {
                if (Object.keys(data[key]).length > 0) {
                    this.setData(data[key], data_2, addKey + key + ".");
                }
            }
            else {
                data_2[addKey + key] = data[key];
            }
        }

        return data_2;
    }


    mapKeyValue(item) {
        var item_2 = {};
        item_2 = this.setData(item, item_2);

        if (this.props.showObject) return this.props.showObject(item, item_2);

        return (
            <div key={item_2.id}>
                {Object.entries(item_2).map(([key, value]) =>
                    this.props.showItem ? this.props.showItem(key, value) : (value ? <p key={key}>{key}: {value}</p> : ""))}
                <hr></hr>
            </div>
        );
    }


    async getData() {
        try {
            var data = this.props.data ? this.props.data : null;
            // console.log(data);
            if (!data) data = await getData(this.props.urlGet, this.props.id);
            // console.log(data);
            return this.setState({ data });
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }


    // props = {
    //     data,
    //     showObject(item),
    //     showObjects(this.state.data),
    //     urlGet,
    //     id,
    //     name,
    // }


    render() {
        if (this.state.data) {
            if (this.props.showObjects) return this.props.showObjects(this.state.data);

            if (this.props.id) return this.mapKeyValue(this.state.data);

            return (
                <div key={this.props.name ? this.props.name : null}>
                    {this.state.data.map(item => this.mapKeyValue(item))}
                </div>
            );
        }
    }
}

export default ShowData;



