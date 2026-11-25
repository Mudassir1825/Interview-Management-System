// ========================================
// 01. LOGIN SESSION
// ========================================

const currentPage =
    window.location.pathname.split("/").pop();

const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

const isGuest =
    localStorage.getItem("guestMode") === "true";


// Login-only pages

const loginOnlyPages = [
    "interviews.html",
    "interview.html",
    "settings.html"
];

if (
    loginOnlyPages.includes(currentPage) &&
    !isLoggedIn
) {
    window.location.href = "index.html";
}


if (
    currentPage === "dashboard.html" &&
    !isLoggedIn &&
    !isGuest
) {
    window.location.href = "index.html";
}

// ---------- Back Button / Browser Cache Protection ----------

window.addEventListener(
    "pageshow",
    function () {

        const currentLoginStatus =
            localStorage.getItem("isLoggedIn") === "true";

        const currentGuestStatus =
            localStorage.getItem("guestMode") === "true";


        // Protected pages

        if (
            loginOnlyPages.includes(currentPage) &&
            !currentLoginStatus
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        // Dashboard

        if (
            currentPage === "dashboard.html" &&
            !currentLoginStatus &&
            !currentGuestStatus
        ) {

            window.location.replace(
                "index.html"
            );

        }

    }
);

// ---------- Back Button / Browser Cache Protection ----------

window.addEventListener(
    "pageshow",
    function () {

        const loggedInNow =
            localStorage.getItem("isLoggedIn") === "true";

        const guestNow =
            localStorage.getItem("guestMode") === "true";


        // Protect Interviews, Add Interview and Settings

        if (
            loginOnlyPages.includes(currentPage) &&
            !loggedInNow
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        // Protect Dashboard from logged-out users

        if (
            currentPage === "dashboard.html" &&
            !loggedInNow &&
            !guestNow
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }

    }
);


// ========================================
// 02. INTERVIEW MANAGEMENT
// ========================================


// ---------- 02.1 Interview Form ----------

const interviewForm =
    document.querySelector(
        ".form-box form"
    );


// ---------- 02.2 Interview Phone ----------

const interviewPhone =
    document.querySelector(
        "#phone"
    );


// ---------- 02.3 Phone Validation ----------

if (
    interviewPhone &&
    currentPage === "interview.html"
) {

    interviewPhone.setAttribute(
        "maxlength",
        "10"
    );

    interviewPhone.setAttribute(
        "inputmode",
        "numeric"
    );

    interviewPhone.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(
                        /[^0-9]/g,
                        ""
                    )
                    .slice(0, 10);

        }
    );

}


// ========================================
// 02.4 ADD / UPDATE INTERVIEW
// ========================================

if (interviewForm) {

    interviewForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ---------- Check Login ----------

            if (
                localStorage.getItem(
                    "isLoggedIn"
                ) !== "true"
            ) {

                alert(
                    "Please sign in to manage interviews."
                );

                window.location.href =
                    "index.html";

                return;

            }


            // ---------- Get Logged In User ----------

            const loggedInUser =
                JSON.parse(
                    localStorage.getItem(
                        "loggedInUser"
                    )
                );


            if (
                !loggedInUser ||
                !loggedInUser.id
            ) {

                alert(
                    "User session not found. Please sign in again."
                );

                localStorage.removeItem(
                    "isLoggedIn"
                );

                window.location.href =
                    "index.html";

                return;

            }


            // ---------- Get Values ----------

            const candidateName =
                document
                    .querySelector(
                        "#candidate-name"
                    )
                    .value
                    .trim();


            const email =
                document
                    .querySelector(
                        "#email"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .querySelector(
                        "#phone"
                    )
                    .value
                    .trim();


            const company =
                document
                    .querySelector(
                        "#company"
                    )
                    .value
                    .trim();


            const position =
                document
                    .querySelector(
                        "#position"
                    )
                    .value
                    .trim();


            const interviewDate =
                document
                    .querySelector(
                        "#date"
                    )
                    .value;


            const interviewTime =
                document
                    .querySelector(
                        "#time"
                    )
                    .value;


            const interviewer =
                document
                    .querySelector(
                        "#interviewer"
                    )
                    .value
                    .trim();


            const mode =
                document
                    .querySelector(
                        "#mode"
                    )
                    .value;


            const status =
                document
                    .querySelector(
                        "#status"
                    )
                    .value;


            // ---------- Check Empty Fields ----------

            if (
                !candidateName ||
                !email ||
                !phone ||
                !company ||
                !position ||
                !interviewDate ||
                !interviewTime ||
                !interviewer ||
                !mode ||
                !status
            ) {

                alert(
                    "Please fill in all the fields."
                );

                return;

            }


            // ---------- Check Phone ----------

            if (
                !/^[0-9]{10}$/.test(
                    phone
                )
            ) {

                alert(
                    "Phone number must contain exactly 10 digits."
                );

                return;

            }


            // ---------- Get Edit ID ----------

            const editInterviewId =
                localStorage.getItem(
                    "editInterviewId"
                );


            // ========================================
            // 02.5 UPDATE EXISTING INTERVIEW
            // ========================================

            if (editInterviewId) {

                try {

                    const response =
                        await fetch(
                            `https://interview-management-system-o1yf.onrender.com/api/interviews/${editInterviewId}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        user_id:
                                            loggedInUser.id,

                                        candidate_name:
                                            candidateName,

                                        email:
                                            email,

                                        phone:
                                            phone,

                                        company:
                                            company,

                                        position:
                                            position,

                                        interview_date:
                                            interviewDate,

                                        interview_time:
                                            interviewTime,

                                        interviewer:
                                            interviewer,

                                        mode:
                                            mode,

                                        status:
                                            status

                                    })

                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok
                    ) {

                        alert(
                            data.message ||
                            "Failed to update interview."
                        );

                        return;

                    }


                    localStorage.removeItem(
                        "editInterviewId"
                    );


                    alert(
                        "Interview updated successfully!"
                    );


                    window.location.href =
                        "interviews.html";


                } catch (error) {

                    console.log(error);

                    alert(
                        "Unable to connect to the server."
                    );

                }


                return;

            }


            // ========================================
            // 02.6 CREATE NEW INTERVIEW
            // ========================================

            try {

                const response =
                    await fetch(
                        "https://interview-management-system-o1yf.onrender.com/api/interviews",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    user_id:
                                        loggedInUser.id,

                                    candidate_name:
                                        candidateName,

                                    email:
                                        email,

                                    phone:
                                        phone,

                                    company:
                                        company,

                                    position:
                                        position,

                                    interview_date:
                                        interviewDate,

                                    interview_time:
                                        interviewTime,

                                    interviewer:
                                        interviewer,

                                    mode:
                                        mode,

                                    status:
                                        status

                                })

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok
                ) {

                    alert(
                        data.message ||
                        "Failed to add interview."
                    );

                    return;

                }


                localStorage.removeItem(
                    "editInterviewId"
                );


                alert(
                    "Interview saved successfully!"
                );


                window.location.href =
                    "interviews.html";


            } catch (error) {

                console.log(error);

                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}


// ========================================
// 02.7 LOAD INTERVIEW FOR EDITING
// ========================================

const editInterviewId =
    localStorage.getItem(
        "editInterviewId"
    );


if (
    editInterviewId &&
    interviewForm &&
    currentPage === "interview.html"
) {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !loggedInUser ||
        !loggedInUser.id
    ) {

        localStorage.removeItem(
            "editInterviewId"
        );

        window.location.href =
            "index.html";

    } else {

        fetch(
            `https://interview-management-system-o1yf.onrender.com/api/interviews/${loggedInUser.id}`
        )
            .then(
                function (response) {

                    return response.json();

                }
            )
            .then(
                function (interviews) {

                    const interview =
                        interviews.find(
                            function (item) {

                                return (
                                    Number(
                                        item.id
                                    ) ===
                                    Number(
                                        editInterviewId
                                    )
                                );

                            }
                        );


                    if (interview) {

                        document.querySelector(
                            "#candidate-name"
                        ).value =
                            interview.candidate_name;


                        document.querySelector(
                            "#email"
                        ).value =
                            interview.email;


                        document.querySelector(
                            "#phone"
                        ).value =
                            interview.phone;


                        document.querySelector(
                            "#company"
                        ).value =
                            interview.company;


                        document.querySelector(
                            "#position"
                        ).value =
                            interview.position;


                        document.querySelector(
                            "#date"
                        ).value =
                            interview.interview_date;


                        document.querySelector(
                            "#time"
                        ).value =
                            interview.interview_time;


                        document.querySelector(
                            "#interviewer"
                        ).value =
                            interview.interviewer;


                        document.querySelector(
                            "#mode"
                        ).value =
                            interview.mode;


                        document.querySelector(
                            "#status"
                        ).value =
                            interview.status;


                        const saveButton =
                            interviewForm.querySelector(
                                ".save-btn"
                            );


                        if (saveButton) {

                            saveButton.textContent =
                                "Update Interview";

                        }

                    } else {

                        localStorage.removeItem(
                            "editInterviewId"
                        );

                        interviewForm.reset();

                    }

                }
            )
            .catch(
                function (error) {

                    console.log(error);

                    alert(
                        "Unable to connect to the server."
                    );

                }
            );

    }

}


// ========================================
// 02.8 NEW INTERVIEW: CLEAR FORM
// ========================================

if (
    interviewForm &&
    currentPage === "interview.html" &&
    !editInterviewId
) {

    interviewForm.reset();


    document.querySelector(
        "#candidate-name"
    ).value = "";


    document.querySelector(
        "#email"
    ).value = "";


    document.querySelector(
        "#phone"
    ).value = "";


    document.querySelector(
        "#company"
    ).value = "";


    document.querySelector(
        "#position"
    ).value = "";


    document.querySelector(
        "#date"
    ).value = "";


    document.querySelector(
        "#time"
    ).value = "";


    document.querySelector(
        "#interviewer"
    ).value = "";


    document.querySelector(
        "#mode"
    ).selectedIndex = 0;


    document.querySelector(
        "#status"
    ).selectedIndex = 0;

}


// ========================================
// 02.9 CAPITALIZE STATUS
// ========================================

function capitalizeStatus(
    status
) {

    if (!status) {

        return "";

    }


    return (
        status.charAt(0).toUpperCase() +
        status.slice(1)
    );

}


// ========================================
// 02.10 DISPLAY INTERVIEWS
// ========================================

function displayInterviews(
    interviews
) {

    const interviewTableBody =
        document.querySelector(
            "#interview-table-body"
        );


    if (!interviewTableBody) {

        return;

    }


    interviewTableBody.innerHTML =
        "";


    // ---------- No Interviews ----------

    if (
        interviews.length === 0
    ) {

        interviewTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >
                    No interviews found.
                </td>

            </tr>

        `;

        return;

    }


    // ---------- Create Rows ----------

    interviews.forEach(
        function (interview) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${interview.candidate_name}
                </td>

                <td>
                    ${interview.company}
                </td>

                <td>
                    ${interview.position}
                </td>

                <td>
                    ${interview.interview_date}
                </td>

                <td>
                    ${interview.interview_time}
                </td>

                <td>

                    <span
                        class="status ${interview.status}"
                    >
                        ${capitalizeStatus(
                            interview.status
                        )}
                    </span>

                </td>

                <td>

                    <button
                        class="edit-btn"
                        data-id="${interview.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${interview.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            interviewTableBody.appendChild(
                row
            );


            // ========================================
            // 02.11 DELETE INTERVIEW
            // ========================================

            const deleteButton =
                row.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                async function () {

                    if (
                        localStorage.getItem(
                            "isLoggedIn"
                        ) !== "true"
                    ) {

                        alert(
                            "Please sign in to manage interviews."
                        );

                        window.location.href =
                            "index.html";

                        return;

                    }


                    const loggedInUser =
                        JSON.parse(
                            localStorage.getItem(
                                "loggedInUser"
                            )
                        );


                    if (
                        !loggedInUser ||
                        !loggedInUser.id
                    ) {

                        alert(
                            "User session not found. Please sign in again."
                        );

                        return;

                    }


                    const id =
                        Number(
                            this.dataset.id
                        );


                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete this interview?"
                        );


                    if (
                        !confirmDelete
                    ) {

                        return;

                    }


                    try {

                        const response =
                            await fetch(
                                `https://interview-management-system-o1yf.onrender.com/api/interviews/${id}`,
                                {
                                    method: "DELETE",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            user_id:
                                                loggedInUser.id

                                        })

                                }
                            );


                        const data =
                            await response.json();


                        if (
                            !response.ok
                        ) {

                            alert(
                                data.message ||
                                "Failed to delete interview."
                            );

                            return;

                        }


                        alert(
                            "Interview deleted successfully!"
                        );


                        loadInterviews();


                    } catch (error) {

                        console.log(error);

                        alert(
                            "Unable to connect to the server."
                        );

                    }

                }
            );


            // ========================================
            // 02.12 EDIT INTERVIEW
            // ========================================

            const editButton =
                row.querySelector(
                    ".edit-btn"
                );


            editButton.addEventListener(
                "click",
                function () {

                    if (
                        localStorage.getItem(
                            "isLoggedIn"
                        ) !== "true"
                    ) {

                        alert(
                            "Please sign in to manage interviews."
                        );

                        window.location.href =
                            "index.html";

                        return;

                    }


                    localStorage.setItem(
                        "editInterviewId",
                        this.dataset.id
                    );


                    window.location.href =
                        "interview.html";

                }
            );

        }
    );

}


// ========================================
// 02.13 LOAD INTERVIEWS FROM BACKEND
// ========================================

async function loadInterviews() {

    const interviewTableBody =
        document.querySelector(
            "#interview-table-body"
        );


    if (!interviewTableBody) {

        return;

    }


    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !loggedInUser ||
        !loggedInUser.id
    ) {

        interviewTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >
                    Please sign in to view interviews.
                </td>

            </tr>

        `;

        return;

    }


    try {

        const response =
            await fetch(
                `https://interview-management-system-o1yf.onrender.com/api/interviews/${loggedInUser.id}`
            );


        const interviews =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                interviews.message ||
                "Failed to load interviews."
            );

            return;

        }


        displayInterviews(
            interviews
        );


    } catch (error) {

        console.log(error);


        interviewTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >
                    Unable to connect to the server.
                </td>

            </tr>

        `;

    }

}


// ========================================
// 02.14 LOAD INTERVIEWS
// ========================================

if (
    document.querySelector(
        "#interview-table-body"
    )
) {

    loadInterviews();

}


// ========================================
// 02.15 SEARCH
// ========================================

const searchInput =
    document.querySelector(
        "#search-input"
    );


// ========================================
// 02.16 STATUS FILTER
// ========================================

const statusFilter =
    document.querySelector(
        "#status-filter"
    );


// ========================================
// 02.17 SEARCH + FILTER
// ========================================

function applyInterviewFilters() {

    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !loggedInUser ||
        !loggedInUser.id
    ) {

        return;

    }


    fetch(
        `https://interview-management-system-o1yf.onrender.com/api/interviews/${loggedInUser.id}`
    )
        .then(
            function (response) {

                return response.json();

            }
        )
        .then(
            function (interviews) {

                const filteredInterviews =
                    interviews.filter(
                        function (interview) {

                            const candidateName =
                                (
                                    interview.candidate_name ||
                                    ""
                                ).toLowerCase();


                            const company =
                                (
                                    interview.company ||
                                    ""
                                ).toLowerCase();


                            const position =
                                (
                                    interview.position ||
                                    ""
                                ).toLowerCase();


                            const matchesSearch =
                                candidateName.includes(
                                    searchText
                                ) ||
                                company.includes(
                                    searchText
                                ) ||
                                position.includes(
                                    searchText
                                );


                            const matchesStatus =
                                selectedStatus ===
                                    "all" ||
                                interview.status ===
                                    selectedStatus;


                            return (
                                matchesSearch &&
                                matchesStatus
                            );

                        }
                    );


                displayInterviews(
                    filteredInterviews
                );

            }
        )
        .catch(
            function (error) {

                console.log(error);

            }
        );

}


// ========================================
// 02.18 SEARCH EVENT
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyInterviewFilters
    );

}


// ========================================
// 02.19 FILTER EVENT
// ========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        applyInterviewFilters
    );

}


// ========================================
// 03. DASHBOARD
// ========================================


// ---------- Dashboard Elements ----------

const dashboardInterviewBody =
    document.querySelector(
        "#dashboard-interview-body"
    );


if (dashboardInterviewBody) {

    // ---------- Logged In User ----------

    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    // ---------- Dashboard Elements ----------

    const totalInterviews =
        document.querySelector(
            "#total-interviews"
        );

    const scheduledInterviews =
        document.querySelector(
            "#scheduled-interviews"
        );

    const completedInterviews =
        document.querySelector(
            "#completed-interviews"
        );

    const cancelledInterviews =
        document.querySelector(
            "#cancelled-interviews"
        );


    // ---------- Display Dashboard ----------

    function displayDashboard(
        interviews
    ) {

        // ---------- Statistics ----------

        if (totalInterviews) {

            totalInterviews.textContent =
                interviews.length;

        }


        if (scheduledInterviews) {

            scheduledInterviews.textContent =
                interviews.filter(
                    function (interview) {

                        return (
                            interview.status ===
                            "scheduled"
                        );

                    }
                ).length;

        }


        if (completedInterviews) {

            completedInterviews.textContent =
                interviews.filter(
                    function (interview) {

                        return (
                            interview.status ===
                            "completed"
                        );

                    }
                ).length;

        }


        if (cancelledInterviews) {

            cancelledInterviews.textContent =
                interviews.filter(
                    function (interview) {

                        return (
                            interview.status ===
                            "cancelled"
                        );

                    }
                ).length;

        }


        // ---------- Recent Interviews ----------

        dashboardInterviewBody.innerHTML =
            "";


        if (interviews.length === 0) {

            dashboardInterviewBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="text-align:center;"
                    >
                        No interviews found.
                    </td>

                </tr>

            `;

            return;

        }


        const recentInterviews =
            [...interviews]
                .reverse()
                .slice(0, 5);


        recentInterviews.forEach(
            function (interview) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${interview.candidate_name}
                    </td>

                    <td>
                        ${interview.company}
                    </td>

                    <td>
                        ${interview.position}
                    </td>

                    <td>
                        ${interview.interview_date}
                    </td>

                    <td>
                        ${interview.interview_time}
                    </td>

                    <td>

                        <span
                            class="status ${interview.status}"
                        >
                            ${capitalizeStatus(
                                interview.status
                            )}
                        </span>

                    </td>

                    <td>

                        <a
                            href="interviews.html"
                            class="action-btn"
                        >
                            View
                        </a>

                    </td>

                `;


                dashboardInterviewBody.appendChild(
                    row
                );

            }
        );

    }


    // ---------- Load Dashboard Data ----------

    async function loadDashboard() {

        if (
            !loggedInUser ||
            !loggedInUser.id
        ) {

            dashboardInterviewBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="text-align:center;"
                    >
                        Please sign in to view interviews.
                    </td>

                </tr>

            `;

            return;

        }


        try {

            const response =
                await fetch(
                    `https://interview-management-system-o1yf.onrender.com/api/interviews/${loggedInUser.id}`
                );


            const interviews =
                await response.json();


            if (!response.ok) {

                alert(
                    interviews.message ||
                    "Failed to load dashboard."
                );

                return;

            }


            displayDashboard(
                interviews
            );


        } catch (error) {

            console.log(error);


            dashboardInterviewBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="text-align:center;"
                    >
                        Unable to connect to the server.
                    </td>

                </tr>

            `;

        }

    }


    // ---------- Load Dashboard ----------

    loadDashboard();


    // ---------- Dashboard Search ----------

    const dashboardSearch =
        document.querySelector(
            "#dashboard-search"
        );


    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "input",
            async function () {

                const searchText =
                    dashboardSearch.value
                        .toLowerCase()
                        .trim();


                if (
                    !loggedInUser ||
                    !loggedInUser.id
                ) {

                    return;

                }


                try {

                    const response =
                        await fetch(
                            `https://interview-management-system-o1yf.onrender.com/api/interviews/${loggedInUser.id}`
                        );


                    const interviews =
                        await response.json();


                    if (!response.ok) {

                        return;

                    }


                    const filteredInterviews =
                        interviews.filter(
                            function (interview) {

                                const candidateName =
                                    (
                                        interview.candidate_name ||
                                        ""
                                    ).toLowerCase();


                                const company =
                                    (
                                        interview.company ||
                                        ""
                                    ).toLowerCase();


                                const position =
                                    (
                                        interview.position ||
                                        ""
                                    ).toLowerCase();


                                return (
                                    candidateName.includes(
                                        searchText
                                    ) ||
                                    company.includes(
                                        searchText
                                    ) ||
                                    position.includes(
                                        searchText
                                    )
                                );

                            }
                        );


                    dashboardInterviewBody.innerHTML =
                        "";


                    if (
                        filteredInterviews.length ===
                        0
                    ) {

                        dashboardInterviewBody.innerHTML = `

                            <tr>

                                <td
                                    colspan="7"
                                    style="text-align:center;"
                                >
                                    No interviews found.
                                </td>

                            </tr>

                        `;

                        return;

                    }


                    filteredInterviews
                        .slice()
                        .reverse()
                        .slice(0, 5)
                        .forEach(
                            function (interview) {

                                const row =
                                    document.createElement(
                                        "tr"
                                    );


                                row.innerHTML = `

                                    <td>
                                        ${interview.candidate_name}
                                    </td>

                                    <td>
                                        ${interview.company}
                                    </td>

                                    <td>
                                        ${interview.position}
                                    </td>

                                    <td>
                                        ${interview.interview_date}
                                    </td>

                                    <td>
                                        ${interview.interview_time}
                                    </td>

                                    <td>

                                        <span
                                            class="status ${interview.status}"
                                        >
                                            ${capitalizeStatus(
                                                interview.status
                                            )}
                                        </span>

                                    </td>

                                    <td>

                                        <a
                                            href="interviews.html"
                                            class="action-btn"
                                        >
                                            View
                                        </a>

                                    </td>

                                `;


                                dashboardInterviewBody.appendChild(
                                    row
                                );

                            }
                        );


                } catch (error) {

                    console.log(error);

                }

            }
        );

    }

}



// ========================================
// 04. SIGN UP
// ========================================

// ---------- Phone Number Validation ----------

const signupPhone = document.querySelector("#signup-form #phone");

if (signupPhone) {
    signupPhone.setAttribute("maxlength", "10");
    signupPhone.setAttribute("inputmode", "numeric");
    signupPhone.setAttribute("pattern", "[0-9]{10}");

    signupPhone.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
    });
}

// ---------- Registration ----------

const signupForm = document.querySelector('form[action="dashboard.html"]');

if (signupForm && document.querySelector("#fullname")) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fullname = document.querySelector("#fullname").value.trim();
        const email = document.querySelector("#signup-email").value.trim();
        const phone = document.querySelector("#phone").value.trim();
        const password = document.querySelector("#signup-password").value;
        const confirmPassword = document.querySelector("#confirm-password").value;

        // Empty Fields

        if (!fullname || !email || !phone || !password || !confirmPassword) {
            alert("Please fill in all the fields.");
            return;
        }

        // Phone Validation

        if (!/^[0-9]{10}$/.test(phone)) {
            alert("Phone number must contain exactly 10 digits.");
            return;
        }

        // Password Validation

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordPattern.test(password)) {
            alert("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        // Confirm Password

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Send Data to Backend

        try {
            const response = await fetch("https://interview-management-system-o1yf.onrender.com/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Signup failed!");
                return;
            }

            alert("Account created successfully!");
            window.location.href = "index.html";

        } catch (error) {
            console.log(error);
            alert("Unable to connect to the server.");
        }
    });
}



// ========================================
// 05. SIGN IN
// ========================================


// ---------- Login Validation ----------

const loginForm =
    document.querySelector(
        "#login-form"
    );


if (
    loginForm &&
    document.querySelector(
        "#email"
    ) &&
    document.querySelector(
        "#password"
    )
) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .querySelector(
                        "#email"
                    )
                    .value
                    .trim();


            const password =
                document
                    .querySelector(
                        "#password"
                    )
                    .value;


            // ---------- Empty Fields ----------

            if (
                !email ||
                !password
            ) {

                alert(
                    "Please enter your email and password."
                );

                return;
            }


            // ---------- Login API ----------

            try {

                const response =
                    await fetch(
                        "https://interview-management-system-o1yf.onrender.com/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email:
                                    email,

                                password:
                                    password
                            })
                        }
                    );


                const data =
                    await response.json();


                // ---------- Login Failed ----------

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Invalid email or password."
                    );

                    return;
                }


                // ---------- Login Successful ----------

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                localStorage.removeItem(
                    "guestMode"
                );


                // Save logged-in user information

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(
                        data.user
                    )
                );


                alert(
                    "Sign in successful!"
                );


                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.log(error);

                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}

// ========================================
// 06. LOGOUT
// ========================================


// ---------- Logout ----------

const logoutButton =
    document.querySelector(
        ".logout"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "isLoggedIn"
            );


            localStorage.removeItem(
                "guestMode"
            );


            localStorage.removeItem(
                "editInterviewId"
            );


            window.location.href =
                "index.html";

        }
    );

}


// ========================================
// 07. PASSWORD VISIBILITY
// ========================================


// ---------- Sign In Password ----------

const passwordInput =
    document.getElementById(
        "password"
    );


const togglePassword =
    document.getElementById(
        "toggle-password"
    );


if (
    passwordInput &&
    togglePassword
) {

    togglePassword.onclick =
        function () {

            const eyeIcon =
                togglePassword.querySelector(
                    "i"
                );


            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";


                eyeIcon.classList.remove(
                    "fa-eye"
                );


                eyeIcon.classList.add(
                    "fa-eye-slash"
                );


                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );


            } else {

                passwordInput.type =
                    "password";


                eyeIcon.classList.remove(
                    "fa-eye-slash"
                );


                eyeIcon.classList.add(
                    "fa-eye"
                );


                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        };

}


// ---------- Sign Up Password ----------

const signupPassword =
    document.getElementById(
        "signup-password"
    );


const toggleSignupPassword =
    document.getElementById(
        "toggle-signup-password"
    );


if (
    signupPassword &&
    toggleSignupPassword
) {

    toggleSignupPassword.onclick =
        function () {

            const eyeIcon =
                toggleSignupPassword.querySelector(
                    "i"
                );


            if (
                signupPassword.type ===
                "password"
            ) {

                signupPassword.type =
                    "text";


                eyeIcon.classList.remove(
                    "fa-eye"
                );


                eyeIcon.classList.add(
                    "fa-eye-slash"
                );


                toggleSignupPassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );


            } else {

                signupPassword.type =
                    "password";


                eyeIcon.classList.remove(
                    "fa-eye-slash"
                );


                eyeIcon.classList.add(
                    "fa-eye"
                );


                toggleSignupPassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        };

}


// ---------- Confirm Password ----------

const confirmPassword =
    document.getElementById(
        "confirm-password"
    );


const toggleConfirmPassword =
    document.getElementById(
        "toggle-confirm-password"
    );


if (
    confirmPassword &&
    toggleConfirmPassword
) {

    toggleConfirmPassword.onclick =
        function () {

            const eyeIcon =
                toggleConfirmPassword.querySelector(
                    "i"
                );


            if (
                confirmPassword.type ===
                "password"
            ) {

                confirmPassword.type =
                    "text";


                eyeIcon.classList.remove(
                    "fa-eye"
                );


                eyeIcon.classList.add(
                    "fa-eye-slash"
                );


                toggleConfirmPassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );


            } else {

                confirmPassword.type =
                    "password";


                eyeIcon.classList.remove(
                    "fa-eye-slash"
                );


                eyeIcon.classList.add(
                    "fa-eye"
                );


                toggleConfirmPassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        };

}


// ========================================
// 08. THEME
// ========================================


// ---------- Apply Theme ----------

function applyTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        ) || "light";


    if (
        savedTheme ===
        "dark"
    ) {

        document.body.classList.add(
            "dark-theme"
        );

    } else {

        document.body.classList.remove(
            "dark-theme"
        );

    }

}


applyTheme();


// ========================================
// 09. SETTINGS
// ========================================


// ---------- 09.1 Settings Elements ----------

const settingsFullname =
    document.querySelector(
        "#settings-fullname"
    );


const settingsEmail =
    document.querySelector(
        "#settings-email"
    );


const settingsPhone =
    document.querySelector(
        "#settings-phone"
    );


const interviewReminders =
    document.querySelector(
        "#interview-reminders"
    );


const applicationUpdates =
    document.querySelector(
        "#application-updates"
    );


const themeSelect =
    document.querySelector(
        "#theme"
    );


const saveSettingsButton =
    document.querySelector(
        ".save-settings-btn"
    );


const changePasswordButton =
    document.querySelector(
        "#change-password-btn"
    );


// ---------- 09.2 Logged In User ----------

const settingsUser =
    JSON.parse(
        localStorage.getItem(
            "loggedInUser"
        )
    );


// ---------- 09.3 Load Profile From MySQL ----------

if (
    settingsFullname &&
    settingsEmail &&
    settingsPhone
) {

    if (
        !settingsUser ||
        !settingsUser.id
    ) {

        alert(
            "Please sign in to view your settings."
        );

        window.location.href =
            "index.html";

    } else {

        fetch(
            `https://interview-management-system-o1yf.onrender.com/api/profile/${settingsUser.id}`
        )
            .then(
                function (response) {

                    return response.json();

                }
            )
            .then(
                function (data) {

                    if (
                        !data.id
                    ) {

                        alert(
                            data.message ||
                            "Failed to load profile."
                        );

                        return;

                    }


                    settingsFullname.value =
                        data.fullname ||
                        "";


                    settingsEmail.value =
                        data.email ||
                        "";


                    settingsPhone.value =
                        data.phone ||
                        "";


                    // Keep logged-in user information updated

                    localStorage.setItem(
                        "loggedInUser",
                        JSON.stringify({

                            id:
                                data.id,

                            fullname:
                                data.fullname,

                            email:
                                data.email,

                            phone:
                                data.phone

                        })
                    );

                }
            )
            .catch(
                function (error) {

                    console.log(error);

                    alert(
                        "Unable to connect to the server."
                    );

                }
            );

    }

}


// ---------- 09.4 Notifications ----------

if (
    interviewReminders &&
    applicationUpdates
) {

    const savedPreferences =
        JSON.parse(
            localStorage.getItem(
                "preferences"
            )
        );


    if (savedPreferences) {

        interviewReminders.checked =
            savedPreferences
                .interviewReminders ===
            true;


        applicationUpdates.checked =
            savedPreferences
                .applicationUpdates ===
            true;

    }

}


// ---------- 09.5 Theme Settings ----------

if (themeSelect) {

    themeSelect.value =
        localStorage.getItem(
            "theme"
        ) || "light";


    themeSelect.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "theme",
                this.value
            );


            applyTheme();

        }
    );

}


// ---------- 09.6 Save Profile Settings ----------

if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        async function () {

            if (
                localStorage.getItem(
                    "isLoggedIn"
                ) !== "true"
            ) {

                alert(
                    "Please sign in to change settings."
                );

                window.location.href =
                    "index.html";

                return;

            }


            const loggedInUser =
                JSON.parse(
                    localStorage.getItem(
                        "loggedInUser"
                    )
                );


            if (
                !loggedInUser ||
                !loggedInUser.id
            ) {

                alert(
                    "User session not found. Please sign in again."
                );

                window.location.href =
                    "index.html";

                return;

            }


            const fullname =
                settingsFullname.value
                    .trim();


            const email =
                settingsEmail.value
                    .trim()
                    .toLowerCase();


            const phone =
                settingsPhone.value
                    .trim();


            // ---------- Empty Fields ----------

            if (
                !fullname ||
                !email ||
                !phone
            ) {

                alert(
                    "Please fill in all profile fields."
                );

                return;

            }


            // ---------- Phone Validation ----------

            if (
                !/^[0-9]{10}$/.test(
                    phone
                )
            ) {

                alert(
                    "Phone number must contain exactly 10 digits."
                );

                return;

            }


            // ---------- Update Profile ----------

            try {

                const response =
                    await fetch(
                        `https://interview-management-system-o1yf.onrender.com/api/profile/${loggedInUser.id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    fullname:
                                        fullname,

                                    email:
                                        email,

                                    phone:
                                        phone

                                })
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok
                ) {

                    alert(
                        data.message ||
                        "Failed to update profile."
                    );

                    return;

                }


                // ---------- Save Preferences ----------

                localStorage.setItem(
                    "preferences",
                    JSON.stringify({

                        interviewReminders:
                            interviewReminders
                                ? interviewReminders.checked
                                : false,

                        applicationUpdates:
                            applicationUpdates
                                ? applicationUpdates.checked
                                : false

                    })
                );


                // ---------- Save Theme ----------

                localStorage.setItem(
                    "theme",
                    themeSelect
                        ? themeSelect.value
                        : "light"
                );


                // ---------- Update Session ----------

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify({

                        id:
                            loggedInUser.id,

                        fullname:
                            fullname,

                        email:
                            email,

                        phone:
                            phone

                    })
                );


                alert(
                    "Settings saved successfully!"
                );


            } catch (error) {

                console.log(error);

                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}


// ---------- 09.7 Settings Phone ----------

if (settingsPhone) {

    settingsPhone.setAttribute(
        "maxlength",
        "10"
    );


    settingsPhone.setAttribute(
        "inputmode",
        "numeric"
    );


    settingsPhone.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(
                        /[^0-9]/g,
                        ""
                    )
                    .slice(0, 10);

        }
    );

}


// ---------- 09.8 Change Password ----------

if (changePasswordButton) {

    changePasswordButton.addEventListener(
        "click",
        async function () {

            if (
                localStorage.getItem(
                    "isLoggedIn"
                ) !== "true"
            ) {

                alert(
                    "Please sign in to change your password."
                );

                window.location.href =
                    "index.html";

                return;

            }


            const loggedInUser =
                JSON.parse(
                    localStorage.getItem(
                        "loggedInUser"
                    )
                );


            if (
                !loggedInUser ||
                !loggedInUser.id
            ) {

                alert(
                    "User session not found. Please sign in again."
                );

                window.location.href =
                    "index.html";

                return;

            }


            // ---------- Current Password ----------

            const currentPassword =
                prompt(
                    "Enter your current password:"
                );


            if (
                currentPassword ===
                null
            ) {

                return;

            }


            if (
                currentPassword.trim() ===
                ""
            ) {

                alert(
                    "Current password cannot be empty."
                );

                return;

            }


            // ---------- New Password ----------

            const newPassword =
                prompt(
                    "Enter your new password:"
                );


            if (
                newPassword ===
                null
            ) {

                return;

            }


            if (
                newPassword.trim() ===
                ""
            ) {

                alert(
                    "New password cannot be empty."
                );

                return;

            }


            // ---------- Strong Password Validation ----------

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;


        if (!passwordPattern.test(newPassword)) {

            alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );

        return;

}


            // ---------- Confirm Password ----------

            const confirmNewPassword =
                prompt(
                    "Confirm your new password:"
                );


            if (
                confirmNewPassword ===
                null
            ) {

                return;

            }


            if (
                newPassword !==
                confirmNewPassword
            ) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            // ---------- Change Password ----------

            try {

                const response =
                    await fetch(
                        `https://interview-management-system-o1yf.onrender.com/api/change-password/${loggedInUser.id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    currentPassword:
                                        currentPassword,

                                    newPassword:
                                        newPassword

                                })
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok
                ) {

                    alert(
                        data.message ||
                        "Failed to change password."
                    );

                    return;

                }


                alert(
                    "Password changed successfully!"
                );


            } catch (error) {

                console.log(error);

                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}



// ========================================
// 10. GUEST MODE
// ========================================


// ---------- 10.1 Skip For Now ----------

const skipButtons =
    document.querySelectorAll(
        "#skip-for-now, #popup-skip-for-now"
    );


skipButtons.forEach(
    function (skipButton) {

        skipButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                // Enable guest mode

                localStorage.setItem(
                    "guestMode",
                    "true"
                );

                // Make sure user is not treated as logged in

                localStorage.removeItem(
                    "isLoggedIn"
                );

                // Close login popup

                const loginOverlay =
                    document.querySelector(
                        ".login-overlay"
                    );

                if (loginOverlay) {

                    loginOverlay.style.display =
                        "none";

                }

                // Redirect from Sign In page to Dashboard

                if (
                    currentPage === "index.html"
                ) {

                    window.location.href =
                        "dashboard.html";

                }

            }
        );

    }
);


// ---------- 10.2 Close Login Popup ----------

const closePopupButton =
    document.querySelector(
        ".close-popup"
    );


const loginOverlay =
    document.querySelector(
        ".login-overlay"
    );


if (
    closePopupButton &&
    loginOverlay
) {

    closePopupButton.addEventListener(
        "click",
        function () {

            loginOverlay.style.display =
                "none";

        }
    );

}


// ---------- 10.3 Guest Dashboard Protection ----------

if (
    currentPage === "dashboard.html" &&
    isGuest &&
    !isLoggedIn
) {

    const managementLinks =
        document.querySelectorAll(
            'a[href="interviews.html"], ' +
            'a[href="interview.html"], ' +
            'a[href="settings.html"]'
        );


    managementLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const loginOverlay =
                        document.querySelector(
                            ".login-overlay"
                        );

                    if (loginOverlay) {

                        loginOverlay.style.display =
                            "flex";

                    }

                }
            );

        }
    );

}



// ========================================
// 11. FORGOT PASSWORD
// ========================================


// ---------- Forgot Password ----------

const forgotPasswordForm =
    document.querySelector(
        "#forgot-password-form"
    );


if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .querySelector(
                        "#email"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        "https://interview-management-system-o1yf.onrender.com/api/forgot-password",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email: email
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "No account found with this email address."
                    );

                    return;
                }


                localStorage.setItem(
                    "resetPasswordEmail",
                    email
                );


                window.location.href =
                    "reset-password.html";


            } catch (error) {

                console.log(error);

                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}


// ========================================
// 12. RESET PASSWORD
// ========================================


// ---------- Reset Password ----------

const resetPasswordForm =
    document.querySelector(
        "#reset-password-form"
    );


if (resetPasswordForm) {

    const resetPasswordEmail =
        localStorage.getItem(
            "resetPasswordEmail"
        );


    if (!resetPasswordEmail) {

        alert(
            "Please start from the Forgot Password page."
        );

        window.location.href =
            "forgot-password.html";

    } else {

        resetPasswordForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const newPassword =
                    document
                        .querySelector(
                            "#new-password"
                        )
                        .value;


                const confirmPassword =
                    document
                        .querySelector(
                            "#confirm-new-password"
                        )
                        .value;


                // ---------- Empty Password ----------

                if (
                    newPassword.trim() ===
                    ""
                ) {

                    alert(
                        "Password cannot be empty."
                    );

                    return;
                }


                // ---------- Strong Password Validation ----------

                const passwordPattern =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;


                if (
                    !passwordPattern.test(
                        newPassword
                    )
                ) {

                    alert(
                        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
                    );

                    return;

                }

                    // ---------- Confirm Password ----------

                    if (
                        newPassword !==
                        confirmPassword
                    ) {

                        alert(
                            "Passwords do not match."
                        );

                        return;
                    }


                // ---------- Update Password ----------

                try {

                    const response =
                        await fetch(
                            "https://interview-management-system-o1yf.onrender.com/api/reset-password",
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        email:
                                            resetPasswordEmail,

                                        password:
                                            newPassword

                                    })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Password reset failed."
                        );

                        return;
                    }


                    // ---------- Remove Reset Data ----------

                    localStorage.removeItem(
                        "resetPasswordEmail"
                    );


                    // ---------- Success ----------

                    alert(
                        "Password reset successfully! Please sign in with your new password."
                    );


                    // ---------- Go To Sign In ----------

                    window.location.href =
                        "index.html";


                } catch (error) {

                    console.log(error);

                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }

}


// ---------- Reset Password Visibility ----------

const toggleNewPassword =
    document.querySelector(
        "#toggle-new-password"
    );


const newPasswordInput =
    document.querySelector(
        "#new-password"
    );


if (
    toggleNewPassword &&
    newPasswordInput
) {

    toggleNewPassword.addEventListener(
        "click",
        function () {

            const eyeIcon =
                this.querySelector(
                    "i"
                );


            if (
                newPasswordInput.type ===
                "password"
            ) {

                newPasswordInput.type =
                    "text";


                eyeIcon.classList.remove(
                    "fa-eye"
                );


                eyeIcon.classList.add(
                    "fa-eye-slash"
                );


                this.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                newPasswordInput.type =
                    "password";


                eyeIcon.classList.remove(
                    "fa-eye-slash"
                );


                eyeIcon.classList.add(
                    "fa-eye"
                );


                this.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


// ---------- Reset Confirm Password Visibility ----------

const resetToggleConfirmPassword =
    document.querySelector(
        "#toggle-confirm-password"
    );


const resetConfirmPasswordInput =
    document.querySelector(
        "#confirm-new-password"
    );


if (
    resetToggleConfirmPassword &&
    resetConfirmPasswordInput
) {

    resetToggleConfirmPassword.addEventListener(
        "click",
        function () {

            const eyeIcon =
                this.querySelector(
                    "i"
                );


            if (
                resetConfirmPasswordInput.type ===
                "password"
            ) {

                resetConfirmPasswordInput.type =
                    "text";


                eyeIcon.classList.remove(
                    "fa-eye"
                );


                eyeIcon.classList.add(
                    "fa-eye-slash"
                );


                this.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                resetConfirmPasswordInput.type =
                    "password";


                eyeIcon.classList.remove(
                    "fa-eye-slash"
                );


                eyeIcon.classList.add(
                    "fa-eye"
                );


                this.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}