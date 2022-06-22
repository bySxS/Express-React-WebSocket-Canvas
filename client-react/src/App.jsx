//import logo from './logo.svg';
import './styles/app.scss';
import Canvas from "./components/Canvas";
import {BrowserRouter, Routes, Route} from 'react-router-dom'

const App = () => {
    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route path='/' element={<Canvas/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
