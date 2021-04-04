import React, { useEffect, useState, useRef } from "react";
import { SketchPicker } from "react-color";
import NavBar from '../components/NavBar'
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import ClassButtonList from "../components/ClassButtonList";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ColorLens from "@material-ui/icons/ColorLens";
import FormGroup from "@material-ui/core/FormGroup";
import IconButton from "@material-ui/core/IconButton";
import ThumbDown from "@material-ui/icons/ThumbDown";
import ThumbUp from "@material-ui/icons/ThumbUp";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd-aligned-rbd';
import {
  cap,
  checkActiveClass,
  colorPallet,
  shuffleArray,
} from "../app-files/general";
import Modal from "../components/Modal";
import NewClass from "./NewClass";
import GeneralClassButtons from "../components/GeneralClassButtons";
import "./Classes.css";
import { Brightness1, InfoOutlined } from "@material-ui/icons";
import { yellow } from "@material-ui/core/colors";
import { Slide } from "@material-ui/core";

const Classes = (props) => {
  const { activeClass, classList } = props;
  console.log("classList inside Classes:", props.classList);
  const [newNameListState, setNewNameListState] = useState([]);
  const [showAddStudentModal, setAddStudentModal] = useState(false);
  const [formatModal, setFormatModal] = useState(false);
  const [showAddNewClassModal, setAddNewClassModal] = useState(false);
  const [format, setFormat] = useState("");
  const [smallStyle, setSmallStyle] = useState({smallGroup:null, smallIcon:null, smallButtons:null, smallFont:null})
  const [changePointsStyle, setChangePointStyle] = useState({});

  // const [container, setContainer] = useState('row-container')
  const showAddStudentHandler = () => {
    setAddStudentModal(true);
    handleCloseMenu();
  };
  const cancelAddStudentHandler = () => {
    setAddStudentModal(false);
  };

  const showAddNewClassHandler = () => {
    setAddNewClassModal(true);
  };
  const cancelAddNewClassHandler = () => {
    setAddNewClassModal(false);
  };

  const showFormatModalHandler = () => {
    setFormatModal(true);
    handleCloseMenu();
  };
  const submitFormatModalHandler = () => setFormatModal(false);

  const handleShuffleClass = () => {
    handleCloseMenu();
    let temp = JSON.parse(JSON.stringify(activeClass));
    let tempClassList = JSON.parse(JSON.stringify(classList));
    let shuffledTemp = shuffleArray(temp.students);
    temp.students = shuffledTemp;
    let newTempList = checkActiveClass(tempClassList, temp);

    props.handleState({ activeClass: temp, classList: newTempList });
  };
  const handleSelection = (index, key) => {
    let temp = JSON.parse(JSON.stringify(activeClass));
    let tempClassList = JSON.parse(JSON.stringify(classList));
    temp.students[index].isChecked = !temp.students[index].isChecked;
    let newTempList = checkActiveClass(tempClassList, temp);
    props.handleState({ activeClass: temp, classList: newTempList });
  };

  const handleAdd = (index, key) => {
    // console.log('handleAdd',index,key)
    let temp = JSON.parse(JSON.stringify(activeClass));
    let tempClassList = JSON.parse(JSON.stringify(classList));

    // console.log(temp)
    temp.students[index].count = temp.students[index].count + 1;
    temp.count = temp.count + 1;
    temp.students[index].pointStyle = "positive";
    let newTempList = checkActiveClass(tempClassList, temp);

    props.handleState({
      activeClass: temp,
      classList: newTempList,
      // classDisplay:tempClassDisplay
    });
  };
  const activeClassRef = useRef(activeClass);
  activeClassRef.current = activeClass;
  const classListRef = useRef(classList);
  classListRef.current=classList;
  const handleClearPointStyle = (index) => {

    let temp = JSON.parse(JSON.stringify(activeClassRef.current));
    let tempClassList = JSON.parse(JSON.stringify(classListRef.current));
    temp.students[index].pointStyle = null
    var newTempList = checkActiveClass(tempClassList, temp);
    // }
    props.handleState({
      activeClass:temp,
      classList:newTempList
    })

  }
  
  const handleSub = (index, key) => {
    let temp = JSON.parse(JSON.stringify(activeClass));
    let tempClassList = JSON.parse(JSON.stringify(classList));

    temp.students[index].count = temp.students[index].count - 1;
    temp.count = temp.count - 1;
    temp.students[index].pointStyle = "negative";

    let newTempList = checkActiveClass(tempClassList, temp);

    props.handleState({
      activeClass: temp,
      classList: newTempList,
    });
  };

  const handleColorClick = (index, key) => {
    let tempClassList = JSON.parse(JSON.stringify(classList));

    let temp = JSON.parse(JSON.stringify(activeClass));
    temp.students[index].displayColorPicker = !temp.students[index]
      .displayColorPicker;
    let newTempList = checkActiveClass(tempClassList, temp);

    props.handleState({ activeClass: temp, classList: newTempList });
  };
  const handleClose = (index, key) => {
    let tempClassList = JSON.parse(JSON.stringify(classList));

    let temp = JSON.parse(JSON.stringify(activeClass));

    temp.students[index].displayColorPicker = false;
    let newTempList = checkActiveClass(tempClassList, temp);

    props.handleState({ activeClass: temp, classList: newTempList });
  };

  const handleColorSelect = (index, e) => {
    let temp = JSON.parse(JSON.stringify(activeClass));
    let tempClassList = JSON.parse(JSON.stringify(classList));

    temp.students[index].background = e.hex;
    let newTempList = checkActiveClass(tempClassList, temp);

    props.handleState({ activeClass: temp, classList: newTempList });
  };
  const [dropdownDisplay, setDropdownDisplay] = React.useState(null);

  const handleClick = (e) => {
    setDropdownDisplay(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setDropdownDisplay(null);
  };

  let draggedItem;
  let dragIndex;
  let newActiveClass = activeClass;
  const onDragStart = (e, index) => {
    draggedItem = activeClass.students[index]; //griddisplay changed from nameList
    console.log("ondragstart", activeClass.students);
    dragIndex = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };
  const onDragOver = (index) => {
    const draggedOverItem = activeClass.students[index];
    let swap = activeClass.students[index];

    // if the item is dragged over itself, ignore
    if (draggedItem === draggedOverItem) {
      return;
    }
    // filter out the currently dragged item
    newActiveClass.students = activeClass.students.filter(
      (item) => item !== draggedItem && item !== swap
    );

    // console.log(index)
    if (dragIndex > index) {
      newActiveClass.students.splice(index, 0, draggedItem);
      newActiveClass.students.splice(dragIndex, 0, swap);
    } else {
      newActiveClass.students.splice(dragIndex, 0, swap);
      newActiveClass.students.splice(index, 0, draggedItem);
    }
    // add the dragged item after the dragged over item
  };
  const onDragEnd = (index) => {
    console.log("onDragEnd", newActiveClass.students);
    let tempClassList = JSON.parse(JSON.stringify(classList));

    let newTempList = checkActiveClass(tempClassList, newActiveClass);
    props.handleState({ activeClass: newActiveClass, classList: newTempList });
    handleGroup();
    handleFormatting();
    // draggedIdx = null;
  };
  // const resetDisplayPositions = list => {
  //   const resetList = list.map((c, index)=> {
  //     const studentCard = c
  //     slide.displayPosition = index+1
  //     return slide
  //   })
  //   return resetList
  // }
  // const getContent = () => resetDisplayPositions()
  const handleOnDragEnd = result => {
    if (!result.destination){
      return;
    }
    let temp = JSON.parse(JSON.stringify(activeClass));
    let tempClassList = JSON.parse(JSON.stringify(classList));
    let draggedItem = activeClass.students[result.source.index];

    let swap = activeClass.students[result.destination.index];
    if (draggedItem === swap) {
      return;
    }
    temp.students = activeClass.students.filter(
      (item) => item !== draggedItem && item !== swap
    );
    if (result.source.index > result.destination.index) {
      temp.students.splice(result.destination.index, 0, draggedItem);
      temp.students.splice(result.source.index, 0, swap);
    } else {
      temp.students.splice(result.source.index, 0, swap);
      temp.students.splice(result.destination.index, 0, draggedItem);
    }
    let newTempList = checkActiveClass(tempClassList, temp);

    props.handleState({
      activeClass:temp,
      classList: newTempList
    })

  }
  const handleOnDragStart = result => {
    let temp = JSON.parse(JSON.stringify(activeClass))
    let draggedItem = activeClass.students[result.source.index];
    temp.students[result.source.index] = draggedItem
    props.handleState({
      activeClass:temp
    })
  }
  // const { classes } = props;
  const popover = {
    position: "absolute",
    zIndex: "2",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  const studentCards = props.activeClass.students.map((record, index) => {
    // console.log('record:',record)
    var key = record.key;
    let keyString = JSON.parse(JSON.stringify(key));
    var backgroundStyle = {
      backgroundColor: record.background,
      filter: "brightness(90%)",
    };
    var backgroundLightStyle = {
      backgroundColor: record.background,
      backgroundImage: `linear-gradient(181deg, rgb(117, 117, 117), ${record.background} 10%, ${record.background})`,
      // backgroundImage: `radial-gradient(
      //   circle at right, rgb(117, 117, 117), ${record.background} 40%)`,
      // filter:'brightness(105%)', //causing flicker on select
    };
    var selectStyle = {
      display: record.isChecked && "flex",
      justifyContent: record.isChecked && 'end'

    };
    var pointStyle =
      record.pointStyle === "positive"
        ? {
            backgroundColor: "yellow",

            backgroundImage:
              "radial-gradient(circle, transparent 40%, #fffac4, #fffde6, white)",
            transition: "background 1s",
            transitionTimingFunction: "ease-in",
            borderRadius: "45%",
          }
        : record.pointStyle === "negative"
        ? {
            backgroundColor: "red",

            backgroundImage:
              "radial-gradient(circle, transparent 40%, #ffc8c4, #ffe6e6, white)",
            transition: "background 0.5s",
            transitionTimingFunction: "ease-out",
            borderRadius: "45%",
          }
        : null;
    // {
    // // backgroundImage: 'radial-gradient(circle, transparent 40%,white)',
    // borderRadius:'45%',

    //   backgroundColor:'transparent',
    //   transition:'background 1s',
    //   transitionTimingFunction: 'ease',
    // }
    function getStyle(style, snapshot) {
      if (!snapshot.isDragging) return {
        display:'inline'
      };
      if (!snapshot.isDropAnimating) {
        return style;
      }
    
      return {
        ...style,
        // cannot be 0, but make it super tiny
        transitionDuration: `0.001s`,
      };
    }
    return (
      <Draggable key={record.key} draggableId={record.key} index={index}>
        {(provided, snapshot) => (

        
      <div className={`student-card-container ${smallStyle.smallIcon}`}style={pointStyle}>
        <div
        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
          key={record.key}
          className="drag"
          style={getStyle(provided.draggableProps.style, snapshot)}
          // draggable="true"
          // onDragStart={(e) => onDragStart(e, index)}
          // onDragEnd={onDragEnd}
          // onDragOver={() => onDragOver(index)}
        >
          <div className="student-icon-container">
            <div className="student-head-button-container">
              
            <div className="student-head"></div>
            <div className="pts-button-container">
              <div className="pts-buttons">
                <IconButton
                  className="icon"
                  onClick={() => {
                    handleSub(index);
                    // handleClearPointStyle(index)
                    
                    setTimeout(()=>{
                      handleClearPointStyle(index)
                    },[2000])
                  }}
                >
                  <ThumbDown />
                </IconButton>
              </div>

              <div className="pts-buttons">
                <IconButton
                  onClick={() => {
                    handleAdd(index);
                    // handleClearPointStyle(index)

                    setTimeout(()=>{
                      handleClearPointStyle(index)
                    },[2000])
                  }}
                >
                  <ThumbUp />
                </IconButton>
              </div>
              </div>
            </div>
            <div className="student-body"></div>
          </div>
          <div className="desk-top" style={backgroundStyle}></div>
          <div className={`desk ${smallStyle.smallFont}`} style={backgroundLightStyle}>
            {record.name}
            <br />

            <div className="desk-button-main-container">
              <div className="desk-button-container">
                <div className={`desk-button ${smallStyle.smallButtons}`}>
                  <IconButton
                    onClick={() => {
                      handleColorClick(index);
                    }}
                  >
                    <ColorLens />
                  </IconButton>
                </div>
                {activeClass.students[index].displayColorPicker ? (
                  <div style={popover}>
                    <div
                      style={cover}
                      onClick={() => {
                        handleClose(index);
                      }}
                    />
                    <SketchPicker
                      color={activeClass.students[index].background}
                      onChange={(e) => {
                        handleColorSelect(index, e);
                      }}
                    />
                  </div>
                ) : null}
                <div className={`desk-button ${smallStyle.smallButtons}`} style={selectStyle}>
                  <FormGroup row>
                    <div key={record.key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            label={key}
                            checked={activeClass.students[index].isChecked}
                            onChange={() => {
                              handleSelection(index);
                            }}
                            value={keyString}
                          ></Checkbox>
                        }
                      />
                    </div>
                  </FormGroup>
                </div>
              </div>
              {record.count}
            </div>
          </div>
        </div>
      </div>
      )}
      </Draggable>
    );
  });

  let group;
  let groupContainer;
  let mainGroupContainer;
  let smallGroup;
  const handleGroup = () => {
    console.log(activeClass.styling.size)
    console.log("handleGroup", activeClass);
    mainGroupContainer = "group-main-container";

    if (format === "rows") {
      group = "row";
      
      groupContainer = "row-container";
      mainGroupContainer = "row-main-container";
      
      // setContainer('row-container')
    } else {
      if (activeClass.styling.groups === 4) {
        group = "group4";
        groupContainer = "group-container4";
        if (activeClass.styling.size==='small'){
          // setSmallStyle({...smallStyle, smallGroup:'small-group4'})
          smallGroup = 'small-group4'
        }
        // setContainer('group-container4')
      } else if (
        activeClass.styling.groups === 5 ||
        activeClass.styling.groups === 6
        
      ) {
        group = "group56";
        groupContainer = "group-container56";
        if (activeClass.styling.size==='small'){
          // setSmallStyle({...smallStyle, smallGroup:'small-group56'})
          smallGroup = 'small-group56'

        }
        // setContainer('group-container56')
      } else if (activeClass.styling.groups === 7) {
        group = "group7";
        groupContainer = "group-container7";
        if (activeClass.styling.size==='small'){
          // setSmallStyle({...smallStyle, smallGroup:'small-group7'})
          smallGroup= 'small-group7'
        }
        // setContainer('group-container7')
      }
    }
  };
  const handleNewStu = () => {
    const newNameArray = props.inputNames.replace(/ /g, "").split(",");
    let temp = JSON.parse(JSON.stringify(props.activeClass));

    for (let x = 0; x < newNameArray.length; x++) {
      // const randColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      const id = cap(newNameArray[x]) + Math.floor(Math.random() * 20);
      let record = {
        name: cap(newNameArray[x]),
        count: 0,
        background: colorPallet(activeClass.styling.theme),
        key: id,
        isChecked: false,
        displayColorPicker: false,
      };
      temp.students.push(record);
    }
    setAddStudentModal(false);
    props.handleState({
      activeClass: temp,
      inputNames: "",
    });
  };
  const handleFormatting = () => {
    console.log(activeClass.styling.groups)
    let formattedNameList = [];
    if (activeClass.styling.groups ===4){
      for (let i = 0; i < studentCards.length; i += activeClass.styling.groups) {
        let newArray = studentCards.slice(i, i + 2);
        let newArray2 = studentCards.slice(i+2, i + 4);
        let combinedArray=[newArray, newArray2]
        // let newArray = props.studentCards.splice(i, props.generalSelection.groups);
        formattedNameList.push(combinedArray);
      }
    }
    // for (let i = 0; i < studentCards.length; i += activeClass.styling.groups) {
    //   let newArray = studentCards.slice(i, i + activeClass.styling.groups);
    //   // let newArray = props.studentCards.splice(i, props.generalSelection.groups);
    //   formattedNameList.push(newArray);
    // }
    console.log("studentCards:", studentCards);
    console.log("formattedNameList:", formattedNameList);
    let newNameList = formattedNameList.map((array, index) => {
      return(
        <div style={{display:'flex', width:'300px', margin:'20px'}}>
      <Droppable droppableId={`group-${index}`} index={index}>
        {(provided)=> (
          // <div >
            <div {...provided.droppableProps} ref={provided.innerRef} className={`${group} ${smallGroup}`} >{array[0]}

          {/* {provided.placeholder} */}
            
            </div>
          // </div>

        )}

    </Droppable>
      <Droppable droppableId={`group-${index}-a`} index={index}>
      {(provided)=> (
        // <div >
          <div {...provided.droppableProps} ref={provided.innerRef} className={`${group} ${smallGroup}`} >{array[1]}

        {/* {provided.placeholder} */}
          
          </div>
        // </div>

      )}

  </Droppable>
  </div>

      )
      
    });
    newNameList = (
      <DragDropContext  onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>

      <div className={mainGroupContainer}>
        <div className={groupContainer}>{newNameList}</div>
      </div>
    </DragDropContext>

    );
    console.log(newNameList);
    setNewNameListState(newNameList);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    let temp = JSON.parse(JSON.stringify(activeClass))
    let tempClassList = JSON.parse(JSON.stringify(classList));
    temp.styling[name] = value;
    if (name==='format') {
      setFormat(value);
    }

    if (name==='size'){
      if (value==='regular'){
        setSmallStyle({smallGroup:null, smallIcon:null, smallButtons:null, smallFont:null})
      }
        if (value==='small'){
        setSmallStyle({
          ...smallStyle,
          smallIcon:'small-icon',
          smallButtons:'small-buttons',
          smallFont:'small-font'
        })
  
  }
    }
    let newTempList = checkActiveClass(tempClassList, temp);
    props.handleState({
      activeClass: temp,
      classList:newTempList
    })
    // handleFormatting()
  };
  useEffect(() => {
    console.log("useEffect");
    handleGroup();
    handleFormatting();
  }, [format, props.activeClass]); //props.generalSelection.groups

  return (
    <React.Fragment>
      <NavBar
        handleState={props.handleState}
        activeClass={props.activeClass}
        classList={props.classList}
        showAddNewClassHandler={showAddNewClassHandler}
      />
      <Modal
        show={showAddStudentModal}
        onCancel={cancelAddStudentHandler}
        header={<div>Add students to {activeClass.title} </div>}
        footerClass="worksheet-item__modal-actions"
        footer={
          <React.Fragment>
            <button onClick={handleNewStu}>ADD STUDENT(S)</button>
          </React.Fragment>
        }
      >
        <TextField
          variant="filled"
          id="filled-basic"
          label={<span className="">Student Names:</span>}
          name="inputNames"
          // type="number"
          value={props.inputNames}
          onChange={props.handleChange}
          className="text-area-styles"
          placeholder="Input student names, separated by a comma"
          required
          multiline
          rows={2}
          rowsMax={3}
        />
      </Modal>
      <Modal
        show={formatModal}
        onCancel={submitFormatModalHandler}
        header={<div>Change the class layout of {activeClass.title} </div>}
        footerClass="worksheet-item__modal-actions"
        footer={
          <React.Fragment>
            <button onClick={submitFormatModalHandler}>SUBMIT</button>
          </React.Fragment>
        }
      >
              
        <FormControl>
          <FormLabel>Icon Size</FormLabel>

          <RadioGroup
            aria-label="size"
            name="size"
            value={props.value}
            onChange={handleChange}
          >
            <FormControlLabel value="small" control={<Radio />} label="Small" />
            <FormControlLabel value="regular" control={<Radio />} label="Regular" />

          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Layout</FormLabel>

          <RadioGroup
            aria-label="format"
            name="format"
            value={props.value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="groups"
              control={<Radio />}
              label="Groups"
            />
            <FormControlLabel value="rows" control={<Radio />} label="Rows" />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <InputLabel>Amount in each group/row</InputLabel>

          <Select
            className="select-form"
            value={activeClass.styling.groups}
            onChange={props.handleInput}
            displayEmpty
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
          </Select>
          {/* <FormHelperText>Without label</FormHelperText> */}
        </FormControl>
        <FormControl>
          <InputLabel>Color Theme</InputLabel>

          <Select
            className="select-form"
            style={{ width: "200px" }}
            value={activeClass.styling.theme}
            onChange={props.handleThemeInput}
            width={10}
            displayEmpty
          >
            <MenuItem value="lightBlueGreen">Light Blue Green</MenuItem>
            <MenuItem value="lightBluePurple">Light Blue Purple</MenuItem>
            <MenuItem value="darkBluePurple">Dark Blue Purple</MenuItem>
          </Select>
          {/* <FormHelperText>Color Theme</FormHelperText> */}
        </FormControl>
      </Modal>
      <Modal
        show={showAddNewClassModal}
        onCancel={cancelAddNewClassHandler}
        header={<div>Create a new class: </div>}
        footerClass="worksheet-item__modal-actions"
        // footer={}
      >
        <NewClass
          inputNames={props.inputNames}
          handleChange={props.handleChange}
          activeClass={activeClass}
          handleState={props.handleState}
          handleInput={props.handleInput}
          inputClassName={props.inputClassName}
          classList={props.classList}
          cancelAddNewClassHandler={cancelAddNewClassHandler}
        />
      </Modal>
      <div className="classes-container">
        <div className="classes-title-menu-container">
          <h1>{props.activeClass.title}</h1>
          <div className="classes-count">{props.activeClass.count}</div>
          <IconButton onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={dropdownDisplay}
            keepMounted
            open={Boolean(dropdownDisplay)}
            onClose={handleCloseMenu}
            getContentAnchorEl={null}
          >
            <MenuItem onClick={showAddStudentHandler}>Add Student</MenuItem>
            <MenuItem onClick={showFormatModalHandler}>Change Layout</MenuItem>
            <MenuItem onClick={handleShuffleClass}>Shuffle Class</MenuItem>

            <MenuItem onClick={handleCloseMenu}>Delete</MenuItem>
          </Menu>
        </div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="students">
            {(provided)=> (
              <div {...provided.droppableProps} ref={provided.innerRef}>{newNameListState}
              {provided.placeholder}
              </div>

            )}

        </Droppable>
        </DragDropContext>
        <div className="multi-select-container">
          <div className="multi-select">
            <GeneralClassButtons
              activeClass={props.activeClass}
              classList={props.classList}
              handleState={props.handleState}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Classes;

