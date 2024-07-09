import { useState, useRef } from 'react';
import _ from 'lodash';
import './App.css';
import data from "./data/orbits.json";
import ActiveCard from './components/ActiveCard';

function App() {
  const [startwidth, setStartwidth] = useState(window.visualViewport.height * 2 - 50);
  const [state, setState] = useState([...data]);
  const [activeOrbit, setActiveOrbit] = useState(null);
  const [activeClient, setActiveClient] = useState(null);

  const containerRef = useRef(null);

  const getStyle = (num) => {
    return ({
      width: startwidth - 245 * num,
      height: ((startwidth - 245 * num) / 2),
      visibility: (startwidth - 245 * num) < 429 && "hidden"
    });
  };

  const getAvatarStyle = (avatQuantity, avatNumber, orbitHeight, id) => {
    const rad = (3.14 / (avatQuantity + 1)) * avatNumber;
    const xCoord = orbitHeight + (orbitHeight * Math.cos(rad));
    const yCoord = orbitHeight - (orbitHeight * Math.sin(rad));
    return ({ left: `${xCoord}px`, top: `${yCoord}px` });
  };

  const handleScroll = (e) => {
    setStartwidth(startwidth + 245);
  };

  const showCard = (e, index, id) => {
    let newArr = [...state];
    let ind;
    newArr[index].clients.map((el, i) => {
      if (el.id === id) ind = i;
    });
    newArr[index].clients[ind].visibility = true;

    setActiveOrbit(index);
    setActiveClient(id);
    setState([...newArr]);
  }

  const hideCard = (index, id) => {
    let newArr = [...state];
    let ind;
    newArr[index].clients.map((el, i) => {
      if (el.id === id) ind = i;
    });
    newArr[index].clients[ind].visibility = false;
    setActiveOrbit(null);
    setActiveClient(null);
    setState([...newArr]);
  }

  const handleMouseDown = _.throttle((e) => {
    if (e.target.className === "orbit_avatar") return;
    containerRef.current.starty = e.pageY;
  }, 100);

  const handleMouseMove = _.throttle((e) => {
    if (!containerRef.current.starty) return;
    if ((containerRef.current.starty - e.pageY) < 0) {
      setStartwidth(startwidth - 245);
    } else {
      setStartwidth(startwidth + 245);
    }
    containerRef.current.starty = null;
  }, 1000);

  const handleMouseUp = (e) => {
    containerRef.current.starty = null;
  }

  return (
    <div className="App">
      <div
        className="container"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}>
        onMouseUp={handleMouseUp}
        {data.map(({ date, clients }, index) =>
          <div className='orbit orbit_5' style={{ ...getStyle(index), zIndex: index === activeOrbit ? 999 : 1 }}>
            {clients.map((client, i, a) =>
              <><div
                className="orbit_avatar"
                style={{ backgroundImage: `url(/images/photos/${client.photo})`, ...getAvatarStyle(a.length, a.length - i, (startwidth - 245 * index) / 2, client.id), zIndex: activeClient === client.id ? 99999 : 1 }}
                onMouseEnter={(e) => showCard(e, index, client.id)}
                onMouseLeave={() => hideCard(index, client.id)}
              >
                {<ActiveCard index={index} client={client} state={state} activeClient={activeClient} />}
              </div>
              </>)}
          </div>
        )}
        <button className="nav_button" onClick={handleScroll}></button>
      </div>
    </div>
  );
}

export default App;
