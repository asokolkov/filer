import React, {useState, useEffect} from 'react';
import classes from './Editor.module.css';
import FileManager from './components/FileManager/FileManager';
import Settings from './components/Settings';
import Countdown from 'react-countdown';
import axios, {post} from 'axios';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import {useParams} from 'react-router-dom';

import svgStatus from '../../icons/status.svg';
import svgSaveAll from '../../icons/saveAll.svg';
import svgSettings from '../../icons/settings.svg';
import IconButton from "./components/IconButton";

const filesInPackLimit = 5;

function fileFromString(text) {
    const currentTime = Date.now();
    return new File([text],
        `${currentTime}.txt`,
        {type: 'text/plain', lastModified: currentTime}
    );
}
const isDirectory = maybeFile => !maybeFile.type && maybeFile.size % 4096 === 0;

const Editor = () => {
    const [files, setFiles] = useState([]);
    const [views, setViews] = useState(null);
    const [time, setTime] = useState(null);
    const [password, setPassword] = useState(null);

    const params = useParams();
    const [settingsClosed, setSettingsClosed] = useState(true);
    const [loadPage, setLoadPage] = useState(true);

    // useEffect(tryLoadData);
    //
    // function tryLoadData() {
    //     const pack = getPack(params.userId, params.packId);
    //     setLoadPage(!!pack);
    //     if (!loadPage) return;
    //     setPassword(pack.password);
    //     setViews(pack.views);
    //     setTime(pack.time);
    //         "archivePath": null
    // }

    // async function unzip(file) {
    //     const zipper = new JSZip();
    //     return await zipper.loadAsync(file);
    // }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         // const result = await axios(
    //         //     'https://jsonplaceholder.typicode.com/todos/1'
    //         // );
    //         // setPackData(result.data);
    //         // const zip = new JSZip();
    //         // const result = {
    //         //     user: 'aaaaa',
    //         //     packId: 'bbbbb',
    //         //     file: zip.file('adaw.txt', fileFromString('clipboardText')),
    //         //     views: 15,
    //         //     time: 1657806540546,
    //         //     password: 'xx',
    //         // };
    //         // if (result.file) setFiles([unzip(result.file)]);
    //         // if (result.views) setViews(views);
    //         // if (result.time) setTime(time);
    //         // if (result.password) setPassword(password);
    //     };
    //     fetchData();
    // }, []);

    function addFiles(newFiles) {
        const fileNames = files.map(file => file.name);
        const result = newFiles.filter(file =>
            !fileNames.includes(file.name) && !isDirectory(file));
        setFiles(files.concat(result).slice(0, filesInPackLimit));
    }

    function onDrop(e) {
        e.preventDefault();
        addFiles([...e.dataTransfer.files]);
    }

    function onDragOver(e) {
        e.preventDefault();
    }

    function onPaste(e) {
        const clipboardText = e.clipboardData.getData('Text');
        if (clipboardText) addFiles([fileFromString(clipboardText)]);
        else {
            const clipboardItems = Object.values(e.clipboardData.items);
            const newFiles = clipboardItems
                .filter(item => item.kind === 'file')
                .map(item => item.getAsFile());
            addFiles(newFiles);
        }
    }

    const renderer = ({days, hours}) => <span>{days} days {hours} hours</span>;

    // function submitChanges() {
    //     // const newPackData = {
    //     //     user: 'tt',
    //     //     packId: 'ff',
    //     //     files: files,
    //     //     views: views,
    //     //     time: time,
    //     //     password: password
    //     // };
    //     // post('/', newPackData);
    //
    //     const zip = new JSZip();
    //     files.forEach(file => zip.file(file.name, file))
    //     zip.generateAsync({type:'blob'}).then(content =>
    //         saveAs(content, 'example.zip'));
    // }

    const toggleSettings = () => setSettingsClosed(!settingsClosed);

    function downloadAllFiles() {
        if (!files.length) return;
        const zip = new JSZip();
        files.forEach(file => zip.file(file.name, file))
        zip.generateAsync({type:'blob'}).then(content =>
            saveAs(content, 'filer.zip'));
    }

    return (
        <div
            className={classes.editor}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onPaste={onPaste}
        >
            <a className={classes.h1} href="/">Filer</a>
            <div className={classes.data}>
                <h2 className={classes.h2}>Views: {views < 0 ? "∞" : views}</h2>
                <h2 className={classes.h2}>
                    Time left:&nbsp;
                    {time && <Countdown date={time} renderer={renderer} autoStart />}
                </h2>
            </div>
            <div className={classes.serviceButtons}>
                <IconButton image={svgStatus} show />
                <IconButton
                    image={svgSaveAll}
                    show={settingsClosed}
                    onClick={downloadAllFiles}
                />
                <IconButton
                    image={svgSettings}
                    onClick={toggleSettings}
                    style={{backgroundColor: settingsClosed ? "" : "#999"}}
                    show
                />
            </div>
            <FileManager
                files={files}
                setFiles={setFiles}
                addFiles={addFiles}
                show={settingsClosed}
            />
            <Settings
                setViews={setViews}
                setTime={setTime}
                setPassword={setPassword}
                show={!settingsClosed}
            />
            <a
                className={classes.link}
                href="https://github.com/vazik66/filer" 
                target="_blank" rel="noreferrer"
            >
                github.com/vazik66/filer
            </a>
        </div>
    );
};

export default Editor;