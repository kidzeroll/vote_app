function Form(props) {
    return (
        <input
            type={props.type ? props.type : "text"}
            className={`bg-slate-800 py-2 px-3 ${props.className}`}
            placeholder={props.placeholder}
            onChange={(e) => props.onChange(e.target.value)}
            value={props.value}
        />
    );
}

export default Form;
