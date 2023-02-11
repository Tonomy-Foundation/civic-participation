import React, { useState, useEffect } from "react";
import { ConsumeAuth } from "../../hooks/authContext";
import { ProposalCategory, ProposalType } from "../../types/civic";

import {
  Grid,
  Typography,
  Radio,
  TextField,
  Button,
  RadioGroup,
  CircularProgress,
  Link
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import background from "../../assets/image/Florencebanner.png";
import { Stars } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { HtmlTooltip } from '../../components/Themes';
import Select from "@material-ui/core/Select";
import { DropzoneArea } from "material-ui-dropzone";
import { Lock } from "@material-ui/icons";
import LocationGoogleMaps from "../../components/Location/LocationGoogleMaps";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../../components/Navbar/Navbar";
import "./ProposalCreate.scss";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    "&::placeholder": {
      color: "#ce2226",
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
    color: "#ce2226",
    "&.Mui-focused": {
      color: "#ce2226",
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
      color: "#000000",
      fontSize: "18px",
    },
    "& .MuiInputBase-root.MuiInput-underline:after": {
      borderBottomColor: "#000000",
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
      color: "#000000",
      fontSize: "25px",
    },
  },
  inputTitle: {
    color: "#000000",
    width: "300px",
    fontSize: "32px",
    disableUnderline: true,
  },
  inputLabelTitle: {
    color: "#000000",
    fontSize: "25px",
  },
}));

const TitleLock = withStyles({
  root: {
      fontSize: "14px"
  }
})(Lock);

const HeaderCustomizeStar = withStyles({
  root: {
    color: "#000000",
    width: "28px",
    height: "28px",
    marginBottom: "-13px",
  },
})(Stars);

const TitleCategoryTypography = withStyles({
  root: {
    color: "#ce2226",
    fontWeight: 500,
    fontSize: "15px",
  },
})(Typography);

const ImageDragTypography = withStyles({
  root: {
    color: "#ce2226",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "14.06px",
    marginBottom: "10px",
  },
})(Typography);

const CategoryRadio = withStyles({
  root: {
    color: "#ce2226",
    fontSize: "14px",
    "&$checked": {
      color: "#ce2226",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const UploadSmallTypographyCreate = withStyles({
  root: {
    fontSize: "15px",
    color: "#BBA24B",
  },
})(Typography);

const UploadLock = withStyles({
  root: {
    color: "#BBA24B",
  },
})(Lock);

export default function ProposalCreate() {
  const authContext = ConsumeAuth();
  const classes = useStyles();
  const history = useHistory();
  const [currencyValue, setCurrencyValue] = useState();
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [location, setLocation] = useState();

  const handleChangeLocation = async (location) => {
    setLocation(location);
  };

  const handleDropDownImage = (files) => {
    setFileError(false);
    setFiles(files);
  };
  const navigateSecurityPage = () => {
    window.open("https://conscious-cities.com/security", "_blank")
  }

  const [loading, setLoading] = useState(false);

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
      budget: null,
    },
  });

  const [placeholder, setPlaceholder] = useState(`
      Please provide a clear description of the infrastructure change.
      Clearly describe how this proposal will impact the neighborhood.
      Explain who will this change have a positive and negative impact on.
  `);

  const handleFileSize = (message) => {
    if (message.search("File is too big") > 0) {
      setFileSizeError(true);
      return;
    }
    setFileSizeError(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let selectedBudget = currencyValue;

    let budget = 0;
    if (currencyValue !== undefined) {
      budget = parseFloat(selectedBudget.replace(',', ''));
    }
    if (location === undefined) {
      setLocationError(true)
      setLoading(false);
      return;
    }
    if (files.length === 0) {
      setFileError(true);
      setLoading(false);
      return;
    }

    await authContext.civic.proposalCreate({
      ...data,
      budget: budget,
      category: +data.category,
      type: +data.type,
      location: `${location.lat},${location.lng}`,
      photo: files[0],
    });

    history.push("/dashboard");
  };

  const UploadButton = withStyles({
    root: {
      backgroundColor: loading ? "rgba(79,79,79, 0.26)" : "#BBA24B",
      borderRadius: 3,
      border: 0,
      color: "white",
      height: 36,
      padding: "0 20px",
      marginLeft: "10px",
      position: "relative",
    },
    label: {
      textTransform: "capitalize",
      fontSize: "14px",
      fontWeight: "500",
    },
  })(Button);

  const getLocation = (location) => {
    setLocation(location);
    setLocationError(false);
  }

  const handleChangeBudget = (budget) => {
    setCurrencyValue(budget)
  }

  const CHARACTER_LIMIT = 1000;

  useEffect(() => {
    async function main() {
      if (!(await authContext.isLoggedIn())) {
        history.push("/login");
        return;
      }
    }
    main();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container>
        <Navbar />
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction="column">
          <Grid className="header-wrap">
            <img src={background} className="header-img" />
          </Grid>
          <div className="main-container-proposal-create">
            <Grid container justify="flex-start">
              <Grid
                item
                xs
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

              <Grid item xs className="upload-button">
                <div>
                  <Grid item>
                    <HtmlTooltip
                      title={
                      <React.Fragment>
                        <div>{<TitleLock />}Proposals, voting and government actions are stored on the blockchain.
                            This data is cryptographically secured and cannot be forged or tampered
                            with by anyone, including the government.&nbsp;
                          <Link className="read-more-link" onClick={navigateSecurityPage}>
                              Click to learn more
                          </Link>
                        </div>
                      </React.Fragment>
                      }
                      arrow
                      interactive
                    >
                      <Grid item container className="tamper-wraper">
                        <Grid item>
                          <UploadSmallTypographyCreate>
                            tamper proof
                          </UploadSmallTypographyCreate>
                        </Grid>
                        <Grid item>
                            <UploadLock />
                        </Grid>
                      </Grid>
                    </HtmlTooltip>
                  </Grid>
                </div>
                <div className="btn-wraper">
                  <UploadButton type="submit" disabled={loading}>
                    SUBMIT
                  </UploadButton>
                  {loading && (
                    <CircularProgress size={24} className="button-progress" />
                  )}
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={7} className="main-wraper ">
                <Grid container item xs={12} spacing={4}>
                  <Grid item>
                    <FormControl className={classes.formControl}>
                      <CurrencyTextField
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
                        className={classes.budgetInputStyle}
                        error={errors.budget !== undefined}
                        control={control}
                        ref={register}
                        key="budget"
                        rules={{ required: true }}
                        value={currencyValue}
                        onChange={(event, value) => handleChangeBudget(value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item className="create-type-wrape">
                    <FormControl className={classes.formControl}>
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
                          required: "Please enter a name",
                        })}
                      >
                        <option aria-label="" value="" />
                        <option value={ProposalType.Create}>New</option>
                        <option value={ProposalType.Update}>Upgrade</option>
                        <option value={ProposalType.Remove}>Remove</option>
                      </Select>
                      {errors.type && (
                        <FormHelperText>Please select a type.</FormHelperText>
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
                    <TitleCategoryTypography className={classes.categoryTitle}>
                      Categories
                    </TitleCategoryTypography>
                  </Grid>

                  <Grid item sm container className="category-checkbox-wrap">
                    <Controller
                      render={(props) => (
                        <RadioGroup
                          {...props}
                          defaultValue={ProposalCategory.Green}
                          aria-label="category"
                          value={+watch("category")}
                          onChange={(e) => {
                            clearErrors(["category"]);
                            setValue("category", e.target.value);
                          }}
                        >
                          {" "}
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={6} container direction="column">
                              <FormControlLabel
                                control={<CategoryRadio />}
                                label="Green space"
                                value={ProposalCategory.Green}
                                defaultChecked={true}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                label="Kids"
                                value={ProposalCategory.Kids}
                                defaultChecked={true}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Safety}
                                label="Safety"
                                defaultChecked={false}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Accessibility}
                                label="Accessibility"
                                defaultChecked={false}
                              />
                            </Grid>
                            <Grid item xs={6} container direction="column">
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Art}
                                label="Art"
                                defaultChecked={false}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Health}
                                label="Health"
                                defaultChecked={false}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Road}
                                label="Roads"
                                defaultChecked={false}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Residential}
                                label="Residential"
                                defaultChecked={false}
                              />
                            </Grid>
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
                      container
                      justify="flex-start"
                    >
                      {errors.category !== undefined && (
                        <FormHelperText>
                          Please select a category.
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container justify="flex-end" className="dropzone-wraper" xs={5}>
                <Grid item xs={9}>
                  <ImageDragTypography>Images</ImageDragTypography>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    dropzoneText="drag files here or click to upload"
                    onChange={(files) => handleDropDownImage(files)}
                    filesLimit={1}
                    showAlerts={false}
                    maxFileSize={2000000}
                    onAlert={(message) => handleFileSize(message)}
                  />
                  {fileError && (
                    <FormHelperText>Image is missing.</FormHelperText>
                  )}
                  {fileSizeError && (
                    <FormHelperText>
                      File is too big. Size limit is 2Mb.
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs container>
                <TextField
                  label="Description"
                  inputProps={{
                    maxLength: CHARACTER_LIMIT,
                  }}
                  margin="normal"
                  multiline
                  fullWidth
                  name="description"
                  inputRef={register({
                    required: "Please enter a description",
                  })}
                  helperText={`(${watch("description")?.length || 0
                    }/${CHARACTER_LIMIT})`}
                  className="description-textarea"
                  error={errors.description !== undefined}
                  placeholder={placeholder}
                />
              </Grid>
              <Grid item xs={12} className="description-helper"></Grid>
            </Grid>
            <Grid item container xs={12} spacing={5}>
              <FormControl></FormControl>
              <Grid item className="googlmap-wrap">
                <LocationGoogleMaps
                  handleChange={handleChangeLocation}
                  location={location}
                  zoom={15}
                  editable={true}
                  getLocation={(location) => getLocation(location)}
                />
              </Grid>
              <Grid item container justify="flex-end">
                {locationError && (<FormHelperText>
                  Please insert location.
                </FormHelperText>)}
              </Grid>
            </Grid>
          </div>
        </Grid>
      </form>
    </div>
  );
}
