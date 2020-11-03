import React, { useState, useEffect } from "react";
import { ConsumeAuth } from '../../hooks/authContext'
import { ProposalCategory, ProposalType } from '../../types/civic';

import {
    Grid,
    Typography,
    Radio,
    TextField,
    Button,
    RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import background from "../../assets/image/heading.png";
import { Stars } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import { DropzoneArea } from "material-ui-dropzone";
import { Lock } from "@material-ui/icons";
import LocationGoogleMaps from "../../components/Location/LocationGoogleMaps";
import { useForm, Controller } from "react-hook-form";
import './ProposalCreate.scss';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    input: {
        "&::placeholder": {
            color: "#599C6D",
            fontSize: 14,
            opacity: 1,
        },
        textAlign: "left",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    inputLabel: {
        color: "#599C6D",
        "&.Mui-focused": {
            color: "#599C6D",
        },
    },
    budgetInputStyle: {
        paddingTop: "23px",
    },
    categoryTitle: {
        paddingTop: "10px",
    },
    margin: {
        margin: theme.spacing(5),
    },
    commonText: {
        marginLeft: "20px",
        "& .MuiInputBase-input": {
            paddingBottom: "5px",
        },
        "& label.Mui-focused": {
            color: "#ffffff",
            fontSize: "18px",
        },
        "& .MuiInputBase-root.MuiInput-underline:after": {
            borderBottomColor: "#ffffff",
        },
        "& .MuiInput-underline:before": {
            borderBottom: "none",
        },
        "& label + .MuiInput-formControl": {
            marginTop: "10px",
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
        },
        "& .makeStyles-inputLabel-118": {
            color: "#ffffff",
            fontSize: "25px",
        },
    },
    inputTitle: {
        color: "white",
        width: "300px",
        fontSize: "32px",
        disableUnderline: true,
    },
    inputLabelTitle: {
        color: "white",
        fontSize: "25px",
    },
}));

const HeaderCustomizeStar = withStyles({
    root: {
        color: "#FFFFFF",
        width: "28px",
        height: "28px",
        marginBottom: "6px",
    },
})(Stars);

const TitleCategoryTypography = withStyles({
    root: {
        color: "#599C6D",
        fontWeight: 500,
        fontSize: "15px",
    },
})(Typography);

const ImageDragTypography = withStyles({
    root: {
        color: "#599C6D",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "14.06px",
        marginBottom: "10px",
    },
})(Typography);

const CategoryRadio = withStyles({
    root: {
        color: "#599C6D",
        fontSize: "14px",
        "&$checked": {
            color: "#599C6D",
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const UploadButton = withStyles({
    root: {
        backgroundColor: "#1261A3",
        borderRadius: 3,
        border: 0,
        color: "white",
        height: 36,
        padding: "0 20px",
        marginLeft: "10px",
    },
    label: {
        textTransform: "capitalize",
        fontSize: "14px",
        fontWeight: "500",
    },
})(Button);

const UploadSmallTypographyCreate = withStyles({
    root: {
        fontSize: "15px",
        color: "#1261A3",
    },
})(Typography);

const UploadLock = withStyles({
    root: {
        color: "#1261A3",
    },
})(Lock);

export default function ProposalCreate() {
    const authContext = ConsumeAuth()
    const classes = useStyles();
    const history = useHistory();

    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState(false);
    const [location, setLocation] = useState({lat: 52.1135031, lng: 4.2829047});

    const handleChangeLocation = async (location) => {
        setLocation(location)
    }

    const handleDropDownImage = (files) => {
        setFileError(false);
        setFiles(files);
    };

    const {
        errors,
        handleSubmit,
        register,
        control,
        setValue,
        clearErrors,
        watch,
    } = useForm({
        criteriaMode: "all",
        defaultValues: {
            category: ProposalCategory.Green,
            budget: null,
        },
    });

    const onSubmit = async (data) => {
        if (files.length === 0) {
            setFileError(true);
            return;
        }

        const create = await authContext.civic.proposalCreate({
            ...data,
            category: +data.category,
            location: `${location.lat},${location.lng}`,
            photos: files
        })

        history.push('/dashboard')
    };

    const CHARACTER_LIMIT = 580;

    useEffect(() => {
        async function main() {
            if (!await authContext.isLoggedIn()) {
                history.push('/login');
                return;
            }
        }
        main();
    }, [])

    return (
        <div className={classes.root}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container direction="column">
                    <Grid className="header-wrap">
                        <img src={background} className="header-img" />
                        <Grid
                            container
                            direction="row"
                            className="header-title"
                            alignItems="center"
                        >
                            <HeaderCustomizeStar />
                            <TextField
                                label="Name your idea"
                                name="title"
                                className={(classes.margin, classes.commonText)}
                                InputProps={{
                                    className: classes.inputTitle,
                                }}
                                InputLabelProps={{
                                    className: classes.inputLabelTitle,
                                }}
                                inputRef={register({
                                    required: "Please enter a name",
                                })}
                                error={errors.title !== undefined}
                            />
                        </Grid>
                    </Grid>
                    <div className="main-container">
                        <Grid container spacing={2}>
                            <Grid item xs={7} className="left-wrap">
                                <Grid container item xs={12} spacing={4}>
                                    <Grid item>
                                        <Controller
                                            as={<CurrencyTextField />}
                                            name="budget"
                                            currencySymbol="€"
                                            outputFormat="string"
                                            decimalCharacter="."
                                            digitGroupSeparator=","
                                            placeholder="Budget"
                                            InputProps={{
                                                classes: {
                                                    input: classes.input,
                                                },
                                            }}
                                            className={classes.budgetInputStyle}
                                            error={errors.budget !== undefined}
                                            control={control}
                                            ref={register}
                                            key="budget"
                                            rules={{ required: true }}
                                            value={null}
                                        />
                                    </Grid>
                                    <Grid item className="type-wrap">
                                        <FormControl
                                            className={classes.formControl}
                                        >
                                            <InputLabel
                                                htmlFor="type-select"
                                                className={classes.inputLabel}
                                            >
                                                Type
                                            </InputLabel>
                                            <Select
                                                native
                                                inputProps={{
                                                    name: "type",
                                                    id: "type-select",
                                                }}
                                                errors={errors}
                                                name="type"
                                                inputRef={register({
                                                    required:
                                                        "Please enter a name",
                                                })}
                                            >
                                                <option
                                                    aria-label=""
                                                    value=""
                                                />
                                                <option value={ProposalType.Create}>New</option>
                                                <option value={ProposalType.Update}>
                                                    Upgrade
                                                </option>
                                                <option value={ProposalType.Remove}>
                                                    Remove
                                                </option>
                                            </Select>
                                            {errors.type && (
                                                <FormHelperText>
                                                    Please select a type.
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    xs={12}
                                    spacing={3}
                                    className="category-wrap"
                                >
                                    <Grid item>
                                        <TitleCategoryTypography
                                            className={classes.categoryTitle}
                                        >
                                            Categories
                                        </TitleCategoryTypography>
                                    </Grid>

                                    <Grid
                                        item
                                        sm
                                        container
                                        className="category-checkbox-wrap"
                                    >
                                        <Controller
                                            render={(props) => (
                                                <RadioGroup
                                                    {...props}
                                                    defaultValue={ProposalCategory.Green}
                                                    aria-label="category"
                                                    value={+watch("category")}
                                                    onChange={(e) => {
                                                        clearErrors([
                                                            "category",
                                                        ]);
                                                        setValue(
                                                            "category",
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    <Grid item xs={12}>
                                                        <FormControlLabel
                                                            control={
                                                                <CategoryRadio />
                                                            }
                                                            label="Green space"
                                                            value={ProposalCategory.Green}
                                                            defaultChecked={
                                                                false
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <CategoryRadio />
                                                            }
                                                            label="Kids"
                                                            value={ProposalCategory.Kids}
                                                            defaultChecked={
                                                                false
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <CategoryRadio />
                                                            }
                                                            value={ProposalCategory.Safety}
                                                            label="Safety"
                                                            defaultChecked={
                                                                false
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <CategoryRadio />
                                                            }
                                                            value={ProposalCategory.Accessibility}
                                                            label="Accessibility"
                                                            defaultChecked={
                                                                false
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FormControlLabel
                                                            control={
                                                                <CategoryRadio />
                                                            }
                                                            value={ProposalCategory.Art}
                                                            label="Art"
                                                            defaultChecked={
                                                                false
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <CategoryRadio />
                                                            }
                                                            value={ProposalCategory.Health}
                                                            label="Health"
                                                            defaultChecked={
                                                                false
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <CategoryRadio />
                                                            }
                                                            value={ProposalCategory.Road}
                                                            label="Roads"
                                                            defaultChecked={
                                                                false
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <CategoryRadio />
                                                            }
                                                            value={ProposalCategory.Residential}
                                                            label="Residential"
                                                            defaultChecked={
                                                                false
                                                            }
                                                        />
                                                    </Grid>
                                                </RadioGroup>
                                            )}
                                            rules={{ required: true }}
                                            name="category"
                                            control={control}
                                        />

                                        <Grid
                                            item
                                            xs={12}
                                            className="checkbox-helper"
                                        >
                                            {errors.category !== undefined && (
                                                <FormHelperText>
                                                    Please select a category.
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <TextField
                                            label="Description"
                                            inputProps={{
                                                maxLength: CHARACTER_LIMIT,
                                            }}
                                            margin="normal"
                                            multiline
                                            rows={10}
                                            fullWidth
                                            name="description"
                                            inputRef={register({
                                                required:
                                                    "Please enter a description",
                                            })}
                                            helperText={`Please describe your proposal and how it will impact the neighborhood (${
                                                watch("description")?.length ||
                                                0
                                            }/${CHARACTER_LIMIT})`}
                                            className="description-textarea"
                                            error={
                                                errors.description !== undefined
                                            }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        className="description-helper"
                                    ></Grid>
                                </Grid>
                            </Grid>
                            <Grid item className="right-wrap" xs={5}>
                                <Grid item xs={12}>
                                    <ImageDragTypography>
                                        Images
                                    </ImageDragTypography>
                                    <DropzoneArea
                                        acceptedFiles={["image/*"]}
                                        dropzoneText="drag files here or click to upload"
                                        onChange={(files) =>
                                            handleDropDownImage(files)
                                        }
                                        filesLimit={1}
                                    />
                                    {fileError && (
                                        <FormHelperText>
                                            Image is missing.
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="googlmap-wrap">
                                        <LocationGoogleMaps handleChange={handleChangeLocation} location={location} zoom={15} />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className="upload-button">
                            <UploadButton type="submit">SUBMIT</UploadButton>
                            <div className="encrypt-wrap">
                                <Grid item>
                                    <UploadSmallTypographyCreate>
                                        tamper proof
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
    );
}
