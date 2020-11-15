import React, { useEffect, useState } from 'react';
import Api from '../../services/Api'

import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
	Grid,
	CircularProgress,
	Link,
	Typography,
	Button,
	ButtonGroup,
	Snackbar,
	IconButton
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { withStyles } from '@material-ui/core/styles';

import { ExpandLess, AccountCircle, Lock, Close as CloseIcon } from '@material-ui/icons';
// import CloseIcon from '@material-ui/icons/Close';

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
import { ConsumeAuth } from '../../hooks/authContext'
import { authTypes } from '../../utils';

import './CreateAccount.scss'


export default function CreateAccount() {
	const history = useHistory();
	const authContext = ConsumeAuth();

	const [loading, setLoading] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState(null);
	const [createAccountType, setCreateAccountType] = useState(authTypes.username);


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
			const regex = /Cannot create account named (.*), as that name is already taken/
			const usernameAlreadyTaken = regex.test(err.response.data);

			if (usernameAlreadyTaken) {
				setMessage('Username already taken. Please, choose a different one.')
			} else {
				setMessage(err.response.data)
			}

			setOpen(true);
			setLoading(false)
		}
	};

	/**
	 * Set the type of account creation: either with username or with SSI
	 * @param {*} event 
	 * @param {*} newCreateAccountType 
	 */
	const handleCreateAccountType = (event, newCreateAccountType) => {
		setCreateAccountType(newCreateAccountType);
	};

	const redirectToSSI = async () => {
		setLoading(true);
		console.log('redirecting to SSI');
		const { ssiClient: {
			url: ssiServerUrl,
			clientId,
			callbackUrl,
			credentialType,
			name: appName,
		} } = authContext;
		// console.log(ssiServerUrl, clientId, callbackUrl, appName);
		// ssiServerUrl already contains '/' at the end
		const url = `${ssiServerUrl}api/utils/jwt/${clientId}`;
		try {
			const response = await Api.get('ssi/token');
			const token = response?.data?.token;
			if (token) {
				window.location.replace(`${ssiServerUrl}verify/${token}`);
				// window.location.replace(`${ssiServerUrl}verify?token=${token}`);
			} else {
				throw Error('There was an error registering user with SSI, please try registering with username');
			}
		} catch (e) {
			setMessage(e.message);
			setOpen(true);
			setLoading(false)
		}
	};

	useEffect(() => {
		async function main() {
			if (await authContext.isLoggedIn()) {
				history.push('/dashboard');
				return;
			}
		}
		main();
	}, [authContext, history])

	const navigateLoginPage = () => {
		history.push("/login")
	}

	const navigateSecurityPage = () => {
		window.open("https://conscious-cities.com/security", "_blank")
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


	const createAccountWithRegistration = (
		<form onSubmit={handleSubmit(onSubmit)} className="create-form">
			<Grid container direction="column" justify="center" alignContent="center">
				<div className="form-ele-wrap">
					<TextInput
						label="Create username"
						name="username"
						color="green"
						errors={errors}
						registerRef={register({
							required: "Up to 13 characters with letters and 1-5.",
							pattern: {
								value: /^[1-5a-zA-Z]{1,13}$/,
								message: "Up to 13 characters with letters and 1-5."
							}
						})}
						defaultText="Up to 13 characters with letters and 1-5"
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
					{loading && <CircularProgress size={24} className="button-progress" />}
				</Grid>
			</Grid>
		</form>
	);

	const createAccountWithSSI = (
		<Grid container justify="flex-end">
			<div className="create-button ssi">
				<ButtonComponent loading={loading} type="button" text="Redirect to SSI" onClick={redirectToSSI} backgroundColor='#1261A3' />
				{loading && <CircularProgress size={24} className="button-progress" />}
			</div>
		</Grid>
	);

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
							{/* create account with username/ssi */}
							<Grid container direction="column" justify="center" alignContent="center" className="create-account-type">
								<ToggleButtonGroup
									value={createAccountType}
									exclusive
									onChange={handleCreateAccountType}
									aria-label="text alignment"
								>
									<ToggleButton value={authTypes.username} aria-label="left aligned">
										using Username
									</ToggleButton>
									<ToggleButton value={authTypes.SSI} aria-label="centered">
										using SSI [Experiemental]
									</ToggleButton>
								</ToggleButtonGroup>
							</Grid>
						</Grid>
						{createAccountType === authTypes.username ? createAccountWithRegistration : createAccountWithSSI}
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}
