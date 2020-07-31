import axios from 'axios'
import React from 'react';
import {Preview} from "./components/Preview";
import {Downloader} from "./components/Downloader";

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ext: 'image/png',
            preview: null,
            file: null,
            transformedImageUrl: null
        }

        this.handleChange = this.handleChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
        window['co'] = this;
    }

    handleChange(event) {
        if (!event.target.files || event.target.files.length === 0) return
        this.setState({
            preview: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0]
        })
    }

    async submitForm() {
        const serverUrl = 'http://localhost:8081';
        const {ext, file} = this.state;
        let formData = new FormData();
        formData.append('image', file);
        formData.append('ext', ext);

        let res = await axios.post(`${serverUrl}/transform`, formData);
        console.log(res);
        if (!res.error) {
            this.setState({transformedImageUrl: res.data.url})
        }
    }

    render() {
        return (
            <div className={'app'}>
                <form onSubmit={this.submitForm}>
                    <label className={'btn'}>
                        Upload Image
                        <input type="file" name={'image'} onChange={this.handleChange} style={{display: 'none'}}/>
                    </label>
                    <select value={this.state.ext}
                            onChange={e => this.setState({ext: e.target.value, transformedImageUrl: null})}>
                        <option value={'image/bmp'}>BMP</option>
                        <option value={'image/jpg'}>JPG</option>
                        <option value={'image/jpeg'}>JPEG</option>
                        <option value={'image/png'}>PNG</option>
                    </select>
                    <button type={'button'} onClick={this.submitForm}>Upload & Transform</button>
                    <Downloader transformedImageUrl={this.state.transformedImageUrl}/>
                </form>
                <Preview original={this.state.preview} transformed={this.state.transformedImageUrl}/>
            </div>
        );
    }
}

export default App;
