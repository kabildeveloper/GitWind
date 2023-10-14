import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import ManageAccountPage from './pages/ManageAccountPage';
import ChangeAccountPage from './pages/ChangeAccountPage';
import CloneRepositoryPage from './pages/CloneRepositoryPage';
import CreateRepository from './pages/CreateRepository';
import { ToastContainer } from 'react-toastify';
import React from 'react';


export default function App() {
	return (
		<section>
			<Navbar/>
			<Router>
				<Routes>
					<Route path='/' element={<LandingPage />} />
					<Route path='/account' element={<ManageAccountPage />} />
					<Route path='/create_repo' element={<CreateRepository />} />
					<Route path='/modify_repo' element={<ChangeAccountPage />} />
					<Route path='/clone_repo' element={<CloneRepositoryPage />} />
					<Route path='*' element={<LandingPage/>} />
				</Routes>
			</Router>
			<ToastContainer style={{width:'max-content'}}/>
		</section>

	);
}
