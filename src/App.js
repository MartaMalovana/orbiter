import { useState, useRef } from 'react';
import _ from 'lodash';
import './App.css';
import data from "./data/orbits.json";
import ActiveCard from './components/ActiveCard';

function App() {
  const [startwidth, setStartwidth] = useState(((window.visualViewport.width / 2) > window.visualViewport.height) ? (window.visualViewport.height * 2 - 50) : (window.visualViewport.width - 50));
  const [state, setState] = useState([...data]);
  const [activeOrbit, setActiveOrbit] = useState(null);
  const [activeClient, setActiveClient] = useState(null);

  const containerRef = useRef(null);

  const getStyle = (num) => {
    return ({
      width: startwidth - 245 * num,
      height: ((startwidth - 245 * num) / 2),
      opacity: (startwidth - 245 * num) < 429 && "0"
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
      return el;
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
      return el;
    });
    newArr[index].clients[ind].visibility = false;
    setActiveOrbit(null);
    setActiveClient(null);
    setState([...newArr]);
  }


  const handleMouseWheel = _.throttle((e) => {
    if (e.deltaY > 0) {
      setStartwidth(startwidth + 245);
    };
    if (e.deltaY < 0) {
      setStartwidth(startwidth - 245);
    };
  }, 500);

  return (
    <div className="App">
      <div
        className="container"
        ref={containerRef}
        onWheel={handleMouseWheel}
      >
        {data.map(({ date, clients }, index) =>
          <div className='orbit orbit_5' style={{ ...getStyle(index), zIndex: index === activeOrbit ? 999 : 1 }}>
            {clients.map((client, i, a) =>
              <><div
                className="orbit_avatar"
                key={client.id}
                style={{ backgroundImage: `url(/images/photos/${client.photo})`, ...getAvatarStyle(a.length, a.length - i, (startwidth - 245 * index) / 2, client.id), zIndex: activeClient === client.id ? 99999 : 1 }}
                onMouseEnter={(e) => showCard(e, index, client.id)}
                onMouseLeave={() => hideCard(index, client.id)}
              >
                {<ActiveCard index={index} client={client} state={state} activeClient={activeClient} style={getAvatarStyle(a.length, a.length - i, (startwidth - 245 * index) / 2, client.id)} />}
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
