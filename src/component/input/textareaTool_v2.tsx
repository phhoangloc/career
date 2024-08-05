'use client'
import React, { useState, useEffect } from 'react'
import ImageModal from '../tool/imageModal_v2';
import { Editor, EditorState, RichUtils, Modifier, AtomicBlockUtils, CompositeDecorator } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Accordion from '../tool/accordion';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import GridViewIcon from '@mui/icons-material/GridView';
import CodeIcon from '@mui/icons-material/Code';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import HtmlIcon from '@mui/icons-material/Html';
type Props = {
    onChange: (e: string) => void,
    value: string,
    sx?: string,
    h1?: boolean,
    h2?: boolean,
    h3?: boolean,
    h4?: boolean,
    h5?: boolean,
    p?: boolean,
    bold?: boolean,
    italic?: boolean,
    li?: boolean
}

const Image = (props: any) => {
    const { src } = props.contentState.getEntity(props.entityKey).getData();
    return <img src={src} alt="" style={{ maxWidth: '100%' }} />;
};
const IDSpan = (props: any) => {
    const { id, children } = props.contentState.getEntity(props.entityKey).getData();
    return <span id={id}>{children}</span>;
};
const decorator = new CompositeDecorator([
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMAGE'
                );
            }, callback);
        },
        component: Image,
    },
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && contentState.getEntity(entityKey).getType() === 'ID'
                );
            }, callback);
        },
        component: IDSpan,
    },
]);

const TextAreaTool_v2 = (props: Props) => {

    const [modalOpen, setModalOpen] = useState<boolean>(false)

    //content
    const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
    const [content, setContent] = useState<string>("");
    // const [content, setContent] = useState<string>("");
    const [newContent, setNewContent] = useState<string>("");
    const contentState = editorState.getCurrentContent();

    //selection
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const block = editorState.getCurrentContent().getBlockForKey(startKey);
    const newEditorState = EditorState.acceptSelection(editorState, selectionState)
    const blockType = block.getType();
    const title = blockType === "header-one" && "h1" || blockType === "header-two" && "h2" || blockType === "header-three" && "h3" || blockType === "header-four" && "h4" || blockType === "header-five" && "h5" || "p"
    const startOffset = selectionState.getStartOffset();
    const [entityKey, setEntityKey] = useState<any>("")
    const [entity, setEntity] = useState<any>("")

    useEffect(() => {
        block.getEntityAt(startOffset) ? setEntityKey(block.getEntityAt(startOffset)) : setEntityKey("")
    }, [block, startOffset])

    useEffect(() => {
        entityKey ? setEntity(contentState.getEntity(entityKey)) : setEntity("")
    }, [entityKey])

    //link
    const [link, setLink] = useState<string>("")
    const [linkImg, setLinkImg] = useState<string>("")
    const [isInputLink, setIsInputLink] = useState<boolean>(false)
    const [isInputLinkImg, setIsInputLinkImg] = useState<boolean>(false)
    const [imgArr, setImgArr] = useState<any[]>([])
    const [isView, setIsView] = useState<boolean>(true)

    const createBlockStyle = (value: any, type: string) => {
        setEditorState(RichUtils.toggleBlockType(value, type));
    }
    const createInlineStyle = (value: any, type: string) => {
        setEditorState(RichUtils.toggleInlineStyle(value, type));
    }
    const createLink = (value: string) => {
        const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: value });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newContentState = Modifier.applyEntity(
            contentStateWithEntity,
            editorState.getSelection(),
            entityKey
        );
        let newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
        newEditorState = newEditorState.getCurrentInlineStyle().has("UNDERLINE") ? RichUtils.toggleInlineStyle(newEditorState, '') : RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE');
        setEditorState(newEditorState);

    }
    const removeLink = () => {
        if (!selectionState.isCollapsed()) {
            const contentStateWithEntity = contentState.createEntity('', 'MUTABLE',);
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newContentState = Modifier.applyEntity(
                contentStateWithEntity,
                editorState.getSelection(),
                entityKey
            );
            let newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
            newEditorState = newEditorState.getCurrentInlineStyle().has("UNDERLINE") ? RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE') : RichUtils.toggleInlineStyle(newEditorState, '');
            setEditorState(newEditorState);
        }
    };
    const createImage = async (value: string) => {
        const contentStateWithEntity = contentState.createEntity('IMAGE', 'MUTABLE', { src: value });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        let newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
        setEditorState(newEditorState);

    }
    const addId = (id: string) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity('ID', 'MUTABLE', { id });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newContentState = Modifier.applyEntity(
            contentStateWithEntity,
            editorState.getSelection(),
            entityKey
        );
        let newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
        setEditorState(newEditorState);
    }

    useEffect(() => {
        const valueState = stateFromHTML(props.value)
        setEditorState(EditorState.createWithContent(valueState, decorator))
    }, [props.value])

    useEffect(() => {
        setContent(stateToHTML(editorState.getCurrentContent()))
    }, [editorState])

    useEffect(() => {
        const valueState = stateFromHTML(newContent)
        setEditorState(EditorState.createWithContent(valueState, decorator))
    }, [newContent])

    useEffect(() => {
        props.onChange && props.onChange(content)
    }, [content])

    const onCheck = (link: string) => {
        isInputLink && createLink(link)
        isInputLinkImg && createImage(link)
        setIsInputLink(false)
        setIsInputLinkImg(false)
        setLink("")
        setLinkImg("")
    }

    useEffect(() => {
        imgArr[0]?.src && createImage(imgArr[0].src)
    }, [imgArr])

    return (
        <div className='ta-left'>
            <div className='bglv1 ps-s top-0px bglv1 pd-5px'>
                <div className='dp-flex h50px jc-space'>
                    {/* <AddPhotoAlternateIcon className='svg40px' onClick={() => { setModalOpen(!modalOpen) }} /> */}
                    <div></div>
                    <div className='dp-flex'>
                        <p className={`svg40px br-5px fontSize75p lh40px  ta-center ${isView ? "bg-main" : ""}`} onClick={() => setIsView(true)} >EDIT</p>
                        <HtmlIcon className={`svg40px br-5px ${isView ? "" : "bg-main"}`} onClick={() => setIsView(false)} />
                    </div>
                </div>
                {isView && <> <div className='dp-flex flex-wrap'>
                    <Accordion title={title} width='100px' data={[
                        { name: "h1", func: () => createBlockStyle(editorState, "header-one") },
                        { name: "h2", func: () => createBlockStyle(editorState, "header-two") },
                        { name: "h3", func: () => createBlockStyle(editorState, "header-three") },
                        { name: "h4", func: () => createBlockStyle(editorState, "header-four") },
                        { name: "h5", func: () => createBlockStyle(editorState, "header-five") },
                        { name: "p", func: () => createBlockStyle(editorState, "paragraph") }
                    ]
                    } />
                    <FormatListBulletedIcon className={`svg40px br-5px ${blockType === "unordered-list-item" ? "bor-1px bg-main" : ""}`} onClick={() => createBlockStyle(editorState, "unordered-list-item")} />
                    <FormatBoldIcon className={`svg40px br-5px ${newEditorState.getCurrentInlineStyle().has("BOLD") ? "bor-1px bg-main" : ""}`} onClick={() => createInlineStyle(editorState, "BOLD")} />
                    <FormatItalicIcon className={`svg40px br-5px ${newEditorState.getCurrentInlineStyle().has("ITALIC") ? "bor-1px bg-main" : ""}`} onClick={() => createInlineStyle(editorState, "ITALIC")} />
                    <FormatUnderlinedIcon className={`svg40px br-5px ${newEditorState.getCurrentInlineStyle().has("UNDERLINE") ? "bor-1px bg-main" : ""}`} onClick={() => createInlineStyle(editorState, "UNDERLINE")} />
                    <AddPhotoAlternateIcon className={`svg40px br-5px `} onClick={() => setModalOpen(!modalOpen)} />
                    <AddLinkIcon className={`svg40px br-5px ${entity && entity.getType() === "LINK" ? "bg-main" : ""}`} onClick={() => { setIsInputLink(!isInputLink) }} />
                    <LinkOffIcon className={`svg40px br-5px `} onClick={() => removeLink()} />
                    {/* <PlaylistAddIcon className={`svg40px br-5px `} onClick={() => addId("123")} /> */}
                </div>
                    <div className={`dp-flex mg-5px-0px trss-1-4 ps-ab ${isInputLink || isInputLinkImg ? "top-100px  zi--0 opa-1" : "top-0px zi--1 opa-0"}`}>
                        <input
                            className='bg-simple br-5px bor-1px'
                            onChange={(e) => { isInputLink && setLink(e.target.value); isInputLinkImg && setLinkImg(e.target.value); }}
                            value={link || linkImg}
                            onFocus={(e) => {
                                e.target.style.outline = 'none'
                            }}>
                        </input>
                        <CloseIcon className={`svg40px br-5px bg-main`} onClick={() => { setIsInputLink(false), setIsInputLinkImg(false) }} />
                        <CheckIcon className={`svg40px br-5px bg-main`} onClick={() => onCheck(link || linkImg)} />
                    </div></>}
            </div>
            <div className={`mh300px pd-10px mg-5px br-5px bs-2px ${props.sx}`} style={{ border: content !== "<p><br></p>" ? "2px solid #666633" : "" }}>
                {isView ?
                    <Editor editorState={editorState} onChange={(editorState) => setEditorState(editorState)} /> :
                    <textarea className='mh300px bglv1 w100p bor-none' onChange={(e) => setNewContent(e.currentTarget.value)} defaultValue={content} onFocus={(e) => { e.target.style.outline = 'none' }}></textarea>
                }
            </div>
            <ImageModal modalOpen={modalOpen} onCanel={() => setModalOpen(false)} onImages={(arr) => { setModalOpen(false), setImgArr(arr) }} />
        </div >
    )
}

export default TextAreaTool_v2