import React, {Component}  from 'react';
import ReactQuill from 'react-quill';

import SelectDropdown from '../components/select';
import Select from 'react-select';

import 'react-quill/dist/quill.snow.css';
import '../styles/editor.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }], //add more besides default fonts
        [{size: []}], //add more besides default sizes
        ['bold', 'italic', 'underline', 'strike', 'code-block'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}, { 'direction': 'rtl' }],
        ['link', 'image', 'video'],
        ['clean']
    ]
}

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'code-block',
    'list', 'bullet', 'indent', "direction",
    'link', 'image', 'video'
]

const categoryOptions = [{value: "life", label: "life"}, {value: "wedding", label: "wedding"}, {value: "gardening", label: "gardening"}];

class EditPost extends Component {
    constructor(props) {
        super(props);
        this.state = props.post ? props.post
        : {
            title: "",
            category: null,
            editorHTML: ""
        }
    }

    shouldComponentUpdate(newProps, newState) {
        return this.state.category !== newState.category; //always return false as editor re-renders internally
    }

    handleTitle = () => {
        let title = document.getElementById("post-title").value;
        this.setState({ title: title });
    }

    handleCategory = (category) => {
        this.setState({ category: category.key });
    }

    handleBody = (html) => {
        this.setState({ editorHTML: html })
    }

    save = () => {
        console.log(this.state); //log it for now
    }

    componentDidMount() {
        document.getElementById("save-post").addEventListener("click", this.save) //add event listener for save event
    }

    render() {
        return (
            <div className="body">
                <div className="post-editor">
                    <form>
                        <label htmlFor="post-title">Title</label>
                        <input onChange={this.handleTitle} type="text" name="post-title" id="post-title" defaultValue={this.state.title} />
                        {/* <SelectDropdown id="post-category" name="post-category" handler={this.handleCategory} selected={{key: "gardening", label: "gardening"}}
                            options={categoryOptions}/> */}
                        <Select value={this.state.category} onChange={this.handleCategory} options={categoryOptions} />
                    </form>
                    <ReactQuill className="post-body-editor"
                        theme="snow"
                        onChange={this.handleBody}
                        value={this.state.editorHTML}
                        bounds=".post-body-editor"
                        placeholder="Write something..."
                        modules={modules}
                        formats={formats}>
                    </ReactQuill>
                    <button className="button" id="save-post">Save</button>
                </div>
            </div>
        )
    }
}

export default EditPost;
