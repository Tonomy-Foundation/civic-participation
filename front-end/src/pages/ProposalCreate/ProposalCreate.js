import React, { useState } from 'react'
import { Grid, Typography, Checkbox, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import background from '../../assets/image/heading.png';
import { Stars } from '@material-ui/icons';
import { withStyles } from "@material-ui/core/styles";
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import { DropzoneArea } from 'material-ui-dropzone'
import { Lock } from '@material-ui/icons';
import LocationGooglMap from '../../components/Location/LocationGooglMap';
// import DragDrop from '../../components/DragDrop';
import { useForm } from "react-hook-form";
import './ProposalCreate.scss';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    input: {
        "&::placeholder": {
            color: "#599C6D",
            fontSize: 14,
            opacity: 1
        },
        textAlign: "left"
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    inputLabel: {
        color: "#599C6D",
        "&.Mui-focused": {
            color: "#599C6D"
        }
    },
    budgetInputStyle: {
        paddingTop: '23px'
    },
    categoryTitle: {
        paddingTop: '10px'
    },
    margin: {
        margin: theme.spacing(5),
    },
    commonText: {
        marginLeft: "20px",
        "& .MuiInputBase-input": {
            paddingBottom: '5px'
        },
        "& label.Mui-focused": {
            color: '#ffffff',
            fontSize: '18px'
        },
        "& .MuiInputBase-root.MuiInput-underline:after": {
            borderBottomColor: '#ffffff',
        },
        "& .MuiInput-underline:before": {
            borderBottom: "none"
        },
        "& label + .MuiInput-formControl": {
            marginTop: '10px',
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottom: "none"
        },
        "& .makeStyles-inputLabel-118": {
            color: "#ffffff",
            fontSize: "25px"
        }
    },
    inputTitle: {
        color: "white",
        width: "300px",
        fontSize: "32px",
        disableUnderline: true
    },
    inputLabelTitle: {
        color: "white",
        fontSize: "25px",
    }
}));

const HearderCustomizeStar = withStyles({
    root: {
        color: '#FFFFFF',
        width: '28px',
        height: '28px',
        marginBottom: '6px'
    }
})(Stars)

const TitleCategoryTypography = withStyles({
    root: {
        color: '#599C6D',
        fontWeight: 500,
        fontSize: '15px',
    }
})(Typography);

const ImageDragTypography = withStyles({
    root: {
        color: '#599C6D',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '14.06px',
        marginBottom: '10px'
    }
})(Typography);

const CategoryCheckbox = withStyles({
    root: {
        color: '#599C6D',
        fontSize: '14px',
        '&$checked': {
            color: '#599C6D',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const UploadButton = withStyles({
    root: {
        backgroundColor: '#1261A3',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 36,
        padding: '0 20px',
        marginLeft: '10px'
    },
    label: {
        textTransform: 'capitalize',
        fontSize: '14px',
        fontWeight: '500'
    },
})(Button);

const UploadSmallTypographyCreate = withStyles({
    root: {
        fontSize: '15px',
        color: '#1261A3',
    }
})(Typography);

const UploadLock = withStyles({
    root: {
        color: '#1261A3'
    }
})(Lock);

export default function ProposalCreate() {
    const classes = useStyles();

    const [stateCheckBox, setStateCheckBox] = useState({
        checkedA: false,
        checkedB: false,
        checkedC: false,
        checkedD: false,
        checkedE: false,
        checkedF: false,
        checkedG: false,
        checkedH: false,
    });

    const [valueBudget, setValueBudget] = useState();

    const [state, setState] = useState({
        type: '',
    });

    const [description, setDescription] = useState({
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna wirl Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna wirl Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna wirl Lorem ipsum dolor sit amet, consectetur adipisicing rl Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna wirl Lorem ipsum dolor sit ame"
    });

    const [files, setFiles] = useState([])

    const [hasErrorType, setHasError] = useState(false)

    const [hasErrorCateory, setHasErrorCategory] = useState(false)

    const [hasErrorDescription, setHasErrorDescription] = useState(false)

    const [hasErrorTitle, setHasErrorTitle] = useState(false)

    const [title, setTitle] = useState("")

    const handleDropDownImage = (files) => {
        setFiles(files)
    }

    const { errors, handleSubmit } = useForm({
        criteriaMode: "all"
    });

    const onSubmit = data => {
        // Title validation
        if (title == "") {
            setHasErrorTitle(true);
        } else {
            setHasErrorTitle(false)
        }
        // Type validation
        if (state.type == "") {
            setHasError(true);
        } else {
            setHasError(false)
        }
        // Categories validation
        for (const [key, value] of Object.entries(stateCheckBox)) {
            if (value == true) {
                setHasErrorCategory(false)
                break;
            } else {
                setHasErrorCategory(true)
            }
        }
        // Description validation
        if (description.content.length >= 100 && description.content.length <= 580) {
            setHasErrorDescription(false)
        } else {
            setHasErrorDescription(true)
        }

    };

    const handleChange = (event) => {
        const name = event.target.name;
        if (event.target.value == "") {
            setHasError(true)
        } else {
            setHasError(false)
        }
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    const handleChangeCheckboxs = (event) => {
        if (event.target.checked) {
            setHasErrorCategory(false);
        } else {
            setHasErrorCategory(true)
        }
        setStateCheckBox({ ...stateCheckBox, [event.target.name]: event.target.checked });
    };

    const CHARACTER_LIMIT = 580;

    const handleChangeDescription = content => event => {
        if (event.target.value.length >= 100 && event.target.value.length <= 580) {
            setHasErrorDescription(false)
        } else {
            setHasErrorDescription(true)
        }
        setDescription({ ...description, [content]: event.target.value });
    };

    const handleChangeTitle = (e) => {
        if (e.target.value == "") {
            setHasErrorTitle(true)
        } else {
            setHasErrorTitle(false)
        }
        setTitle(e.target.value)
    }

    return (
        <div className={classes.root}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container direction="column">
                    <Grid className="hearder-wrap">
                        <img src={background} className="hearder-img" />
                        <Grid container direction="row" className="hearder-title" alignItems="center">
                            <HearderCustomizeStar />
                            <TextField
                                label="Name your idea"
                                className={classes.margin, classes.commonText}
                                InputProps={{
                                    className: classes.inputTitle
                                }}
                                InputLabelProps={{
                                    className: classes.inputLabelTitle,
                                }}
                                value={title}
                                onChange={handleChangeTitle}
                            />
                            {hasErrorTitle && <FormHelperText>Please select a title.</FormHelperText>}
                        </Grid>
                    </Grid>
                    <div className="main-container">
                        <Grid container spacing={2}>
                            <Grid item xs={7} className="left-wrap">
                                <Grid container item xs={12} spacing={4}>
                                    <Grid item>
                                        <CurrencyTextField
                                            value={valueBudget}
                                            currencySymbol="€"
                                            outputFormat="string"
                                            decimalCharacter="."
                                            digitGroupSeparator=","
                                            placeholder="Budget"
                                            onChange={(event, value) => setValueBudget(value)}
                                            InputProps={{
                                                classes: {
                                                    input: classes.input
                                                }
                                            }}
                                            className={classes.budgetInputStyle}
                                        />
                                    </Grid>
                                    <Grid item className="type-wrape">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="type-select" className={classes.inputLabel}>Type</InputLabel>
                                            <Select
                                                native
                                                value={state.type}
                                                onChange={handleChange}
                                                inputProps={{
                                                    name: 'type',
                                                    id: 'type-select',
                                                }}
                                                errors={errors}
                                            >
                                                <option aria-label="" value="" />
                                                <option value="new">New</option>
                                                <option value="upgrade">Upgrade</option>
                                                <option value="remove">Remove</option>
                                            </Select>
                                            {hasErrorType && <FormHelperText>Please select a type.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} spacing={3} className="catergory-wrape">
                                    <Grid item>
                                        <TitleCategoryTypography className={classes.categoryTitle}>Categories</TitleCategoryTypography>
                                    </Grid>
                                    <Grid item sm container className="category-checkbox-wrape">
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <CategoryCheckbox
                                                        checked={stateCheckBox.checkedA}
                                                        onChange={handleChangeCheckboxs}
                                                        name="checkedA" />
                                                }
                                                label="Green space"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <CategoryCheckbox
                                                        checked={stateCheckBox.checkedB}
                                                        onChange={handleChangeCheckboxs}
                                                        name="checkedB" />
                                                }
                                                label="Kids"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <CategoryCheckbox
                                                        checked={stateCheckBox.checkedC}
                                                        onChange={handleChangeCheckboxs}
                                                        name="checkedC" />
                                                }
                                                label="Safety"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <CategoryCheckbox
                                                        checked={stateCheckBox.checkedD}
                                                        onChange={handleChangeCheckboxs}
                                                        name="checkedD" />
                                                }
                                                label="Accessibility"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <CategoryCheckbox
                                                        checked={stateCheckBox.checkedE}
                                                        onChange={handleChangeCheckboxs}
                                                        name="checkedE" />
                                                }
                                                label="Art"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <CategoryCheckbox
                                                        checked={stateCheckBox.checkedF}
                                                        onChange={handleChangeCheckboxs}
                                                        name="checkedF" />
                                                }
                                                label="Health"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <CategoryCheckbox
                                                        checked={stateCheckBox.checkedG}
                                                        onChange={handleChangeCheckboxs}
                                                        name="checkedG" />
                                                }
                                                label="Roads"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <CategoryCheckbox
                                                        checked={stateCheckBox.checkedH}
                                                        onChange={handleChangeCheckboxs}
                                                        name="checkedH" />
                                                }
                                                label="Residential"
                                            />
                                        </Grid>
                                        <Grid item xs={12} className="checkbox-helper">
                                            {hasErrorCateory && <FormHelperText>Please select a type.</FormHelperText>}
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <TextField
                                            label="Description"
                                            inputProps={{
                                                maxLength: CHARACTER_LIMIT,
                                            }}
                                            value={description.content}
                                            helperText={`${description.content.length}/${CHARACTER_LIMIT}`}
                                            onChange={handleChangeDescription("content")}
                                            margin="normal"
                                            multiline
                                            rows={10}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} className="description-helper">
                                        {hasErrorDescription && <FormHelperText>Description must be at min 100 to 580 characters. </FormHelperText>}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item className="right-wrap" xs={5}>
                                <Grid item xs={12}>
                                    <ImageDragTypography>Images</ImageDragTypography>
                                    <DropzoneArea
                                        dropzoneText="drag files here or click to upload"
                                        onChange={() => handleDropDownImage(files)}
                                        filesLimit={1}
                                        // showPreviewsInDropzone={true}
                                    />
                                    {/* <DragDrop /> */}

                                </Grid>
                                <Grid item xs={12}>
                                    <div className="googlmap-wrape">
                                        <LocationGooglMap />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className="upload-button">
                            <UploadButton type="submit" >
                                UPLOAD
                            </UploadButton>
                            <div className="encrypt-wrape">
                                <Grid item>
                                    <UploadSmallTypographyCreate>
                                        encrypted
                                    </UploadSmallTypographyCreate>
                                </Grid>
                                <Grid item>
                                    <UploadLock />
                                </Grid>
                            </div>
                        </Grid>
                    </div>
                </Grid>
            </form>
        </div>
    )
}
