function Home() {
  return (
    <div>
      <main className="container my-2">
        <section className="bg-light">
          <div className="container p-5">
            <div className="row gx-5 justify-content-center">
              <div className="col-xxl-8">
                <div className="text-center my-4">
                  <h2 className="display-5 fw-bolder">
                    <span className="text-gradient d-inline">EduInsights</span>
                  </h2>
                  <p className="lead fw-light mb-4">
                    A Teacher and Student Review System.
                  </p>
                  <p className="text-muted" id="font">
                  The EduInsights System involves a verification process where college verify teachers and students using unique IDs, minimizing proxy users. Once verified, teachers and students gain full profiles. Teachers are rated by their college students on parameters like teaching ability and behavior, with additional fields like suggestions and comments. Ratings occur monthly, and the data generates graphical dashboards showing teacher performance trends, aiding college in evaluating teacher potential.
                  <br />
                  <br />
                  To encourage honest feedback, student anonymity is ensured, reducing fear of retaliation. Teachers can also rate students, helping institutions assess student potential for placements and other opportunities on semester basis.
                  <br />
                  <br />
                  In future development, the system will integrate AI/ML technologies to analyze textual feedback, providing deeper insights into teacher and student performance with minimal effort.

                  </p>
                  <div className="d-flex justify-content-center fs-2 gap-4">
                    <a className="text-gradient" href="#!">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a className="text-gradient" href="#!">
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a className="text-gradient" href="#!">
                      <i className="bi bi-github"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="text-center m-3">
                {/* <div>Please feel free to reach us if you have any opinions or features we should include in the application to make it more usefull for you. Mail us on support@eduinsights.in</div> */}
                <div>&copy; Copyright 2024 by eduinsights.in || All Rights Reserved</div>
            </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
