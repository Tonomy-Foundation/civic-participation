import React from "react";
import Routes from "./routes";
import Providers from './providers';
import "./App.css";
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './components/Themes';

function App() {
    return (
        <div>
            <Providers>
                <ThemeProvider theme={theme}>
                    <Routes history />
                </ThemeProvider>
            </Providers>
        </div>
    );
}

export default App;
