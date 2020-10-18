import React from 'react';
import { ConsumeAuth } from '../../hooks/authContext'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Grid } from '@material-ui/core';
import { ExpandLess } from '@material-ui/icons';
import { Link } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { AccountCircle, Lock } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import ButtonComponent from '../../components/Button';
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import {
	GreenTextTypography,
	TitleSmallTextTypography,
	TitleLargeTextTypography,
	backgroundStyle,
	HtmlTooltip
} from '../../components/Themes';
import './CreateAccount.scss'

export default function CreateAccount() {
	const history = useHistory();
	const authContext = ConsumeAuth()

	const [loading, setLoading] = React.useState(false)
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState(null);

	const handleClose = (_, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const { register, errors, handleSubmit, watch } = useForm({
		criteriaMode: "all"
	});

	const onSubmit = async ({ username, password, firstname, lastname }) => {
		setLoading(true)

		try {
			await authContext.createAccount(username, password, `${firstname} ${lastname}`)
			history.push('/dashboard')
		} catch (err) {
			setMessage(err.message)
			setOpen(true);
			setLoading(false)
		}
	};

	const navigateLoginPage = () => {
		history.push("/login")
	}

	const navigateSecurityPage = () => {
		window.open("security", "_blank")
	}

	const GreenSmallTypographyCreate = withStyles({
		root: {
			fontSize: '15px',
			color: '#1261A3',
		}
	})(Typography);

	const CreateLock = withStyles({
		root: {
			color: '#1261A3'
		}
	})(Lock);

	const TitleLock = withStyles({
		root: {
			fontSize: "14px"
		}
	})(Lock);

	const LogoCreateUserIcon = withStyles({
		root: {
			color: '#1261A3',
			fontSize: 30,
			lineHeight: 0
		}
	})(AccountCircle);

	const LogoCreateTitle = withStyles({
		root: {
			color: '#1261A3',
			fontSize: '30px',
			lineHeight: '35px'
		}
	})(Typography);


	return (
		<>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				message={message}
				action={
					<React.Fragment>
						<Button color="secondary" size="small" onClick={handleClose}>
							UNDO
					</Button>
						<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
				}
			/>
			<Grid container spacing={0} direction="row">
				<Grid container item xs={6} spacing={0} className="col-item col-left">
					<Grid container direction="column" style={backgroundStyle.style}>
						<Grid container direction="column" justify="center" alignContent="center" className="subject-title">
							<GreenTextTypography variant="h3">
								Concious Cities
							</GreenTextTypography>
						</Grid>
						<Grid container direction="column" justify="center" alignContent="center" className="description-title">
							<Grid item>
								<TitleSmallTextTypography variant="h4">shape</TitleSmallTextTypography>
							</Grid>
							<Grid item>
								<TitleLargeTextTypography>YOUR CITY</TitleLargeTextTypography>
							</Grid>
							<Grid item>
								<TitleSmallTextTypography variant="h5">in new ways</TitleSmallTextTypography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<Grid container item xs={6} spacing={0} className="col-item col-right">
					<Grid container direction="column" justify="center" alignContent="center" className="create-inner">
						<Grid container direction="row" justify="flex-start" alignContent="center" alignItems="center">
							<Grid item className="logo-wrap">
								<LogoCreateUserIcon />
							</Grid>
							<Grid item className="left-margin">
								<LogoCreateTitle>Create account</LogoCreateTitle>
							</Grid>
						</Grid>
						<form onSubmit={handleSubmit(onSubmit)} className="create-form">
							<Grid container direction="column" justify="center" alignContent="center">
								<div className="form-ele-wrap">
									<TextInput
										label="Create username"
										name="username"
										color="green"
										errors={errors}
										registerRef={register({
											required: "Up to 13 characters with letters and 0-5.",
											pattern: {
												value: /^[0-5a-zA-Z]{1,13}$/,
												message: "Up to 13 characters with letters and 0-5."
											}
										})}
										defaultText="Up to 13 characters with letters and 0-5"
									/>
								</div>
								<div className="form-ele-wrap">
									<TextInput
										label="First name"
										name="firstname"
										color="green"
										errors={errors}
										registerRef={register({ required: "Please enter a firstname." })}
									/>
								</div>
								<div className="form-ele-wrap">
									<TextInput
										label="Last name"
										name="lastname"
										color="green"
										errors={errors}
										registerRef={register({ required: "Please enter a lastname." })}
									/>
								</div>
								<div className="form-ele-wrap">
									<PasswordInput
										label="Enter your password"
										name="password"
										color="green"
										errors={errors}
										registerRef={register({
											required: "Please enter a password.",
											minLength: {
												value: 8,
												message: "At least 8 characters."
											}
										})}
									/>
								</div>
								<div className="form-ele-wrap">
									<PasswordInput
										label="Enter your confirm password"
										name="confirmpassword"
										color="green"
										errors={errors}
										registerRef={register({
											required: "Please enter a confirm password.",
											validate: (value) => value === watch('password') || "Passwords don't match."
										})}
									/>
								</div>
							</Grid>
							<Grid container item justify="center" alignContent="center">
								<Link className="create-account-link" onClick={navigateLoginPage}>
									LOGIN
								</Link>
							</Grid>
							<Grid container item justify="center" alignContent="center">
								<ExpandLess />
							</Grid>
							<Grid container direction="row" justify="flex-end" alignItems="center">
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
									<div className="encrypt-wrape">
										<Grid item>
											<GreenSmallTypographyCreate>
												tamper proof
										</GreenSmallTypographyCreate>
										</Grid>
										<Grid item>
											<CreateLock />
										</Grid>
									</div>
								</HtmlTooltip>
								<Grid item className="create-button">
									<ButtonComponent loading={loading} type="submit" text="Create" backgroundColor='#1261A3' />
								</Grid>
							</Grid>
						</form>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}
