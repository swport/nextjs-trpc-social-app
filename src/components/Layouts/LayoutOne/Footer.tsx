import React from "react";
import Link from "@/components/UI/Link";

const leftbarBottomNavDividerStyle = {
	"--bs-breadcrumb-divider": "'∙'",
} as React.CSSProperties;

const Footer = () => {
	return (
		<footer className="ms-3 mb-3 mt-5">
			<p className="fs-sm text-muted">
				2024, NextTRPCSocial.
				<br />
				Open source project.
			</p>
			<nav style={leftbarBottomNavDividerStyle} aria-label="breadcrumb">
				<ol className="breadcrumb mt-3" style={{ fontSize: "16px" }}>
					<li className="breadcrumb-item">
						<Link href="/">
							<small>Home</small>
						</Link>
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
