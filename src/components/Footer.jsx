import React from 'react'
import './css/footer.css'
import { AiFillGoogleCircle } from "react-icons/ai";
import { IoLogoAppleAppstore } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
const Footer = () => {
    return (
        <footer>
            <div className='flex'>
                <div className="footer-left">
                    <h2>Absolute Cinema</h2>
                    <div className="social-icons">
                        <span><AiFillGoogleCircle /></span>
                        <span><IoLogoAppleAppstore /></span>
                        <span><FaFacebook /></span>
                    </div>
                </div>

                <div className="footer-sections">
                    <div className="section">
                        <h3>Institucional</h3>
                        <p>Sobre nós</p>
                        <p>Localização</p>
                        <p>Privacidade e Segurança</p>
                        <p>Termos e Condições</p>
                    </div>
                    <div className="section">
                        <h3>Central de Ajuda</h3>
                        <p>Fale conosco</p>
                        <p>FAQ</p>
                    </div>
                    <div className="section">
                        <h3>Atendimento</h3>
                        <p>Telefone: (11) 98765-4321</p>
                        <p>Email: absolute@cinema.br</p>
                        <p>Horário: Todos os dias das 17h00 às 21h00</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer