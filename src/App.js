import React, {Component} from 'react';
import './App.scss';
import {Button} from '@material-ui/core';
import Database from './database.js'

class App extends Component {
    state = {
        images: [],
        imageGrid: [],
        voters: undefined,
        votes: undefined,
    }
    getAllData = () => {
        let images = [];
        Database.getData().then(res => {
            console.log(res);
            res.forEach(item => {
                if (item.item === undefined) {
                    images.push(item);
                } else if(item.item === 'user-list') {
                    const votes = item.users.length;
                    const voters = [];
                    item.users.forEach(user => {
                        if (!voters.includes(user)) {
                            voters.push(user);
                        }
                    })
                    this.setState({votes, voters: voters.length})
                }
            })
            this.setState({images}, () => {
                this.generateImages();
            })
        }).catch(error => {
            console.log(error);
        })
    }
    generateImages = () => {
        let imageGrid = [];
        this.state.images.forEach(image => {
            imageGrid.push(
                <div className='image-box'>
                    <img src={image.url}></img>
                    <h3>{image.chooserCount}</h3>
                </div>
            )
        })
        this.setState({imageGrid}, () => {
            this.sortArray();
        });
    }
    sortArray = () => {
        let imageGrid = [...this.state.imageGrid]; 
        let newImageGrid = [...imageGrid];
        let imageNumbers = [];
        imageGrid.forEach(image => {
            imageNumbers.push(image.props.children[1].props.children)
        })
        imageNumbers.sort((a, b) => {
            return b - a;
        })
        imageGrid.forEach(image => {
            const imageNumber = image.props.children[1].props.children;
            const index = imageNumbers.findIndex(number => {
                return number === imageNumber;
            })
            newImageGrid.splice(index, 1, image);
        })
        console.log(newImageGrid);
        this.setState({imageGrid: newImageGrid});
    }
    componentDidMount = () => {
        this.getAllData();
    }
    render() {
        return(
            <div>
                <div className='backpanel'>
                    <h1>תוצאות - תמונת השנה</h1>
                    <div className='summary'>
                        <h3>סה״כ הצבעות: {this.state.votes}</h3>
                        <h3>סה״כ מצביעים: {this.state.voters}</h3>
                    </div>
                    <div className='image-grid'>
                        {this.state.imageGrid}
                    </div>
                </div>
            </div>
        )
    }
}

export default App;