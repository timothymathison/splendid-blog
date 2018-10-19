import React, {Component}  from 'react';
import ReactQuill from 'react-quill';

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

class EditPost extends Component {
    constructor(props) {
        super(props);
        this.state = props.post ? props.post
        : {
            title: "",
            description: "",
            category: "",
            editorHTML: ""
        }
    }

    shouldComponentUpdate() {
        return false; //always return false as editor re-renders internally
    }

    handleChange = (html) => {
        this.setState({ editorHTML: html })
    }

    save = () => {
        console.log(this.state.editorHTML); //log it for now
    }

    componentDidMount() {
        document.getElementById("save-post").addEventListener("click", this.save) //add event listener for save event
    }

    render() {
        return (
            <div className="body">
                <div className="post-editor">
                    <form>
                        <label for="post-title">Title</label>
                        <input type="text" name="post-title" id="post-title" defaultValue={this.state.title} />
                        <label for="post-description">Description</label>
                        <input type="text" name="post-description" id="post-description" defaultValue={this.state.description} />
                    </form>
                    <ReactQuill className="post-body-editor"
                        theme="snow"
                        onChange={this.handleChange}
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
