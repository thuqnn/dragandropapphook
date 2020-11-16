import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"; //drag and drop package
import _ from "lodash"; //manager func,object,array,conllection...
import { v4 } from "uuid"; //generate id
import "./App.css";

const item = {
  id: v4(),
  name: "clean the house",
};
const item2 = {
  id: v4(),
  name: "clean the bathroom",
};
function App() {
  const [text, setText] = useState();
  const [state, setState] = useState((initialState) => ({
    todo: {
      title: "Todo",
      items: [item, item2],
    },
    "in-progress": {
      title: "In Progress",
      items: [],
    },
    done: {
      title: "Complete",
      items: [],
    },
  }));

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
    //create copy item before remove state
    const itemCopy = { ...state[source.droppableId].items[source.index] };
    setState((prev) => {
      prev = { ...prev };
      //remove item previous from array
      prev[source.droppableId].items.splice(source.index, 1);

      //add item location from array
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );
      return prev;
    });
  };

  const addItem = () => {
    setState((prev) => {
      return {
        ...prev,
        todo: {
          title: "todo",
          items: [
            {
              id: v4(),
              name: text,
            },
            ...prev.todo.items,
          ],
        },
      };
    });
    setText("");
  };

  return (
    <div className="App">
      <div className={"addNewText"}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addItem}>Add</button>
      </div>
      <div className="draganddrop">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className={"column"}>
                <h3>{data.title}</h3>
                <Droppable droppableId={key}>
                  {(provide, snapshot) => {
                    return (
                      <div
                        ref={provide.innerRef}
                        {...provide.droppableProps}
                        className={"droppable-col"}
                      >
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provide, snapshot) => {
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    ref={provide.innerRef}
                                    {...provide.draggableProps}
                                    {...provide.dragHandleProps}
                                  >
                                    {el.name}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provide.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
