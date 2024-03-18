import React from "react";

const leftbarBottomNavDividerStyle = {
	"--bs-breadcrumb-divider": "'∙'",
} as React.CSSProperties;

const Footer = () => {
	return (
		<footer className="ms-3 mb-3 mt-5">
			<small>&copy; 2023, mylo.com. All rights reserved.</small>
			<nav style={leftbarBottomNavDividerStyle} aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href="#">
							<small>Home</small>
						</a>
					</li>
					<li className="breadcrumb-item" aria-current="page">
						<a href="#">
							<small>Privacy policy</small>
						</a>
					</li>
					<li className="breadcrumb-item" aria-current="page">
						<a href="#">
							<small>Terms of use</small>
						</a>
					</li>
				</ol>
			</nav>
		</footer>
	);
};

export default Footer;
