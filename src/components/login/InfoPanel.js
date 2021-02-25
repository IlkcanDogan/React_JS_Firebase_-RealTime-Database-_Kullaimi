import React, {useState} from 'react'

export default function InfoPanel() {
	const [text, setText] = useState('');
	const [icon, setIcon] = useState(1);
	const dfText = 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.';
	
	const textChange = (value) => {
		if(value === 1) {
			setText(dfText)
			setIcon(1)
		}
		else if(value === 2){
			setText('But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes.')
			setIcon(2)
		}
		else if(value === 3) {
			setText('On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their.')
			setIcon(3)
		}
	}
	return (
		<div id="login-info-card" className="col-12 col-md-5 col-xl-5">
			<div className="d-flex justify-content-center mt-5">
				<img className="mt-5" src="iot-logo.png" alt="logo" />
			</div>
			<h5 className="mt-5">Lorem Ipsum Dolar Sit Amet</h5>
			<p id="info-text">{text ? text : dfText  }</p>
			<div id="login-info-card-bottom" className="d-flex justify-content-center">
				<i id="icon-1" className={icon === 1 ? 'fa fa-dot-circle-o': 'fa fa-circle-o'} aria-hidden="true" onClick={() => textChange(1)}></i>
				<i id="icon-2" className={icon === 2 ? 'fa fa-dot-circle-o': 'fa fa-circle-o'} aria-hidden="true" onClick={() => textChange(2) }></i>
				<i id="icon-3" className={icon === 3 ? 'fa fa-dot-circle-o': 'fa fa-circle-o'} aria-hidden="true" onClick={() => textChange(3)}></i>
			</div>
		</div>
	)
}
