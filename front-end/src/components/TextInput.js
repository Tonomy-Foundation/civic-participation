import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import { ErrorMessage } from "@hookform/error-message";

export default function TextInput(props) {
    let color = '#227B3C';
    if (props.color === "blue") {
        color = '#1261A3';
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(1),
        },
        commonText: {
            "& label.Mui-focused": {
                color: color,
            },
            "& .MuiInputBase-root.MuiInput-underline:after": {
                borderBottomColor: color,
            }
        }
    }));

    const classes = useStyles();
    const [defaultText,] = useState(props.defaultText)

    return (
        <>
            <Grid className="input-container">
                <TextField
                    name={props.name}
                    className={classes.margin + ' ' + classes.commonText}
                    label={props.label}
                    value={props.value}
                    inputRef={props.registerRef}
                />
            </Grid>
            <p className="createuser-msg">{defaultText}</p>
            <ErrorMessage
                errors={props.errors}
                name={props.name}
                render={({ messages }) => {
                    return messages
                        ? Object.entries(messages).map(([type, message]) => (
                            <p key={type}>{message}</p>
                        ))
                        : null;
                }}
            />
        </>
    )
}
