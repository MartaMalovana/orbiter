import { useState } from "react";

export default function ActiveCard({ index, client, state, activeClient }) {
    const [fullText, setFullText] = useState(false);

    let ind;
    state[index].clients.map((el, i) => {
        if (el.id === client.id) ind = i;
        return el;
    });
    const visibility = state[index].clients[ind].visibility;

    const handleOpen = () => {
        setFullText(!fullText);
    }

    return (<div className='active_card' style={{ visibility: visibility === true ? "visible" : "hidden" }}>
        <div className='active_card_header'>
            <img src={`/images/photos/${client.photo}`} width="100px" height="100px" alt="avatar" />
            <div>
                <p className="client_name">{client.name}</p>
                <p className="client_position">{client.position}</p>
                <p className="client_city">{client.city}</p>
                <div style={{ height: "30px", display: "flex", alignItems: "center" }}>
                    <div className="client_photoContainer">
                        {client.connections.map((el, i) => <img src={`/images/photos/${el}`} className="client_photo" style={{ left: `${i * 15}px` }} alt="connections avatar" key={i} />)}
                    </div>
                    <p className="client_photoDescription">{client.photoDescription}</p>
                </div>
            </div>
        </div>
        <div className="active_card_msg">
            <div><p className="msg_title">{client.msgTitle}</p></div>
            <div className="msg_container">
                <p className="msg_time">Saturday, November 4 2023 at 9:04 AM EST<span>2 days ago</span></p>
                <p className="msg_subject">Collaboration Opportunity for Product Expansion</p>
                <p className="msg_text" style={{ whiteSpace: fullText ? "normal" : "nowrap" }}>I hope this message finds you well. I wanted to reach out to discuss a potential collaboration opportunity that could significantly benefit both of our organizations.</p>
                <button className="msg_btn" onClick={handleOpen}>{fullText ? "Less" : "More"}<span style={{ transform: fullText ? "rotate(180deg)" : "none" }} /></button>
            </div>
        </div>
    </div>)
}