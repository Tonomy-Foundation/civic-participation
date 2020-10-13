import React from 'react';
import { ConsumeAuth } from '../../hooks/authContext'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Grid } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Link } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { AccountCircle, Lock } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import {
	GreenTextTypography,
	TitleSmallTextTypography,
	TitleLargeTextTypography,
	backgroundStyle,
	HtmlTooltip
} from '../../components/Themes';
import './Login.scss';

export default function Login() {
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

	const { register, errors, handleSubmit } = useForm({
		criteriaMode: "all"
	});

	const onSubmit = async ({username, password}) => {
		setLoading(true)

		try {
			await authContext.civic.accountLogin(username, password)
			authContext.setIsLoggedIn(true)
			history.push('/dashboard')
		} catch (err) {
			setMessage(err.message)
			setOpen(true);
			setLoading(false)
		}
	};

	const navigateCreatePage = () => {
		history.push("/")
	}

	const LoginButton = withStyles({
		root: {
			backgroundColor: '#227B3C',
			borderRadius: 3,
			border: 0,
			color: 'white',
			height: 36,
			width: 100,
			padding: '0 30px',
			marginLeft: '10px'
		},
		label: {
			textTransform: 'capitalize',
		},
	})(Button);

	const GreenSmallTypography = withStyles({
		root: {
			fontSize: '15px',
			color: '#227B3C',
		}
	})(Typography);

	const LogoIcon = withStyles({
		root: {
			color: '#227B3C',
			fontSize: 30,
			lineHeight: 0
		}
	})(AccountCircle);

	const LoginLock = withStyles({
		root: {
			color: '#227B3C'
		}
	})(Lock);

	const TitleLoginTypography = withStyles({
		root: {
			color: '#227B3C',
			fontSize: '30px',
			lineHeight: '35px'
		}
	})(Typography);

	const navigateSecurityPage = () => {
		window.open("security", "_blank")
	}

	const TitleLock = withStyles({
		root: {
			fontSize: "14px"
		}
	})(Lock);

	const CircularProgressComponent = withStyles({
		root: {
			color: '#fff'
		}
	})(CircularProgress);

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
					<Grid container direction="column" justify="center" alignContent="center" className="login-inner">
						<Grid container direction="row" justify="flex-start" alignContent="center" alignItems="center">
							<Grid item className="logo-wrap">
								<LogoIcon />
							</Grid>
							<Grid item className="left-margin">
								<TitleLoginTypography>Login</TitleLoginTypography>
							</Grid>
						</Grid>
						<form onSubmit={handleSubmit(onSubmit)} className="login-form">
							<Grid container direction="column" justify="center" alignContent="center">
								<div className="form-ele-wrap">
									<TextInput
										label="Username"
										name="username"
										color="green"
										errors={errors}
										registerRef={register({ required: "Please enter a username." })}
									/>
								</div>
								<div className="form-ele-wrap">
									<PasswordInput
										label="Enter your password"
										name="password"
										color="green"
										errors={errors}
										registerRef={register({ required: "Please enter a password." })}
									/>
								</div>
							</Grid>
							<Grid container item justify="center" alignContent="center">
								<Link className="login-account-link" onClick={navigateCreatePage}>
									CREATE ACCOUNT
								</Link>
							</Grid>
							<Grid container item justify="center" alignContent="center">
								<ExpandMore />
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
											<GreenSmallTypography>
												tamper proof
									</GreenSmallTypography>
										</Grid>
										<Grid item>
											<LoginLock />
										</Grid>
									</div>
								</HtmlTooltip>
								<Grid item className="login-button">
									<LoginButton disabled={loading} type="submit">
										{loading ? <CircularProgressComponent size={14} className="circular-progress" /> : 'LOGIN'}
									</LoginButton>
								</Grid>
							</Grid>
						</form>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}
