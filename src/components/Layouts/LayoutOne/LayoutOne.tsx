import React from "react";
import Leftbar from "./Leftbar";
import Footer from "./Footer";

const LayoutOne: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<React.Fragment>
			<div className="container">
				<div className="row">
					<div className="col-12 col-md-5 col-lg-3">
						<div className="sticky-top">
							<div className="card vh-100 overflow-auto border-top-0 border-bottom-0 position-relative">
								<div className="card-body">
									<Leftbar />
								</div>
								<Footer />
							</div>
						</div>
					</div>
					<div className="col-md">
						<main>
							<div className="row">
								<div className="col-12 col-lg-8">{children}</div>
								<div className="col-12 col-lg-4"></div>
							</div>
						</main>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default LayoutOne;
