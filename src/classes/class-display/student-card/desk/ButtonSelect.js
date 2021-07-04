import React from 'react';
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useSelector, connect } from 'react-redux';

const ButtonSelect = props => {
  const {smallStyle, record, index} = props;
  const activeClass = useSelector((state)=>state.activeClass)
  const classList = useSelector((state)=>state.classList)

  var selectStyle = {
    display: record.isChecked && "flex",
    justifyContent: record.isChecked && "end",
  };

  var key = record.key;
  let keyString = JSON.parse(JSON.stringify(key));

  const handleSelection = (index) => {
    let temp = JSON.parse(JSON.stringify(activeClass));
    temp.students[index].isChecked = !temp.students[index].isChecked;
    props.handleUpdate(temp, classList);
  };

  return(
    <div
      className={`desk-button ${smallStyle.smallButtons}`}
      style={selectStyle}
    >
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
                style={{ color: "#065361" }}
              ></Checkbox>
            }
          />
        </div>
      </FormGroup>
    </div>
  )
}
const mapDispatchToProps = (dispatch) => {
  return {
    handleUpdate: (temp, tempClassList) => {
      dispatch({ type: "UPDATE_CLASS", temp, tempClassList });
    },
  };
};
export default connect(null, mapDispatchToProps)(ButtonSelect);