import React from "react";


const TextArea = ({ name, label, error, ...rest }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea {...rest} name={name} id={name} className="form-control"></textarea>
            {error && (Array.isArray(error) ?
                error.map(item => <div className="alert alert-danger">{item}</div>) :
                <div className="alert alert-danger">{error}</div>)
            }
        </div>
    );
};

export default TextArea;