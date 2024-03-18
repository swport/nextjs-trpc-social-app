import { useSession } from "next-auth/react";
import React from "react";
import {
	AiOutlineHome,
	AiOutlineSearch,
	AiOutlineCompass,
	AiOutlineUser,
	AiOutlineSetting,
} from "react-icons/ai";
import Link from "@/components/UI/Link";

const Leftbar = () => {
	const { data: session, status } = useSession();

	return (
		<ul className="list-group list-group-flush gap-4 position-relative">
			<li className="list-group-item my-2 my-md-4 border-0 site-logo">
				<h3>
					<a href="http://localhost:3000">myIlo.com</a>
				</h3>
			</li>
			<li className="list-group-item">
				<a href="http://localhost:3000" className="d-flex align-items-center">
					<AiOutlineHome size="2em" title="Home" />
					<span className="ms-3">Home</span>
				</a>
			</li>
			<li className="list-group-item">
				<a href="http://localhost:3000" className="d-flex align-items-center">
					<AiOutlineSearch size="2em" title="Home" />
					<span className="ms-3">Search</span>
				</a>
			</li>
			<li className="list-group-item">
				<a href="http://localhost:3000" className="d-flex align-items-center">
					<AiOutlineCompass size="2em" title="Home" />
					<span className="ms-3">Explore</span>
				</a>
			</li>
			<li className="list-group-item">
				<a href="http://localhost:3000" className="d-flex align-items-center">
					<AiOutlineSetting size="2em" title="Home" />
					<span className="ms-3">Settings</span>
				</a>
			</li>
			<li className="list-group-item mt-3 mt-md-5">
				<Link
					href="http://localhost:3000/profile"
					authModal={true}
					scroll={false}
					className="d-flex align-items-center"
				>
					<AiOutlineUser size="2em" title="Home" />
					{status === "loading" ? (
						<div className="spinner-border spinner-border-sm ms-1" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					) : (
						<span className="ms-3">{session?.user ? session?.user.name : "Profile"}</span>
					)}
				</Link>
			</li>
		</ul>
	);
};

export default Leftbar;
