document.getElementById("form1").addEventListener("submit", submitFun1);

var studentDataArr = JSON.parse(localStorage.getItem("studentData")) || [];

// ---------------- ADD STUDENT ----------------
function submitFun1(e) {
    e.preventDefault();

    var studentObj = {
        name: document.querySelector("#name").value,
        number: document.querySelector("#number").value,
        city: document.querySelector("#city").value,
        rollNo: document.querySelector("#rollNo").value,
        attendance: ""
    };

    studentDataArr.push(studentObj);
    localStorage.setItem("studentData", JSON.stringify(studentDataArr));

    document.querySelector("#form1").reset();
    displayFun();
}

// ---------------- DISPLAY TABLE ----------------
function displayFun() {

    document.querySelector("#tbody").innerHTML = "";

    studentDataArr.forEach(function (item, index) {

        var tr = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.innerText = index + 1;

        var td2 = document.createElement("td");
        td2.innerText = item.name;

        var td3 = document.createElement("td");
        td3.innerText = item.number;

        var td4 = document.createElement("td");
        td4.innerText = item.city;

        var td5 = document.createElement("td");
        td5.innerText = item.rollNo;

        var td6 = document.createElement("td");

        // If attendance marked → show only status
        if (item.attendance === "Present" || item.attendance === "Absent") {

            var status = document.createElement("span");
            status.innerText = item.attendance;
            status.style.fontWeight = "bold";
            status.style.marginRight = "10px";
            status.style.color = item.attendance === "Present" ? "green" : "red";

            td6.append(status);

        } else {

            // Present Button
            var btnP = document.createElement("button");
            btnP.innerText = "P";
            btnP.className = "btn btn-success btn-sm";
            btnP.style.marginRight = "5px";

            btnP.addEventListener("click", function () {
                studentDataArr[index].attendance = "Present";
                localStorage.setItem("studentData", JSON.stringify(studentDataArr));
                displayFun();
            });

            // Absent Button
            var btnA = document.createElement("button");
            btnA.innerText = "A";
            btnA.className = "btn btn-danger btn-sm";

            btnA.addEventListener("click", function () {
                studentDataArr[index].attendance = "Absent";
                localStorage.setItem("studentData", JSON.stringify(studentDataArr));
                displayFun();
            });

            td6.append(btnP, btnA);
        }

        // Delete Button (Always Visible)
        var deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.style.marginLeft = "10px";

        deleteBtn.addEventListener("click", function () {
            studentDataArr.splice(index, 1);
            localStorage.setItem("studentData", JSON.stringify(studentDataArr));
            displayFun();
        });

        td6.append(deleteBtn);

        tr.append(td1, td2, td3, td4, td5, td6);
        document.querySelector("#tbody").append(tr);
    });
}

displayFun();


// ---------------- DOWNLOAD PDF (TABLE FORMAT) ----------------
function downloadPDF() {

    if (studentDataArr.length === 0) {
        alert("No student data available!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // -------- School Name --------
    doc.setFontSize(18);
    doc.text("Shri Muktanand College Gangapur", 105, 15, { align: "center" });

    // -------- Date --------
    let today = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text("Date: " + today, 14, 25);

    // -------- Count Present / Absent --------
    let presentCount = 0;
    let absentCount = 0;

    studentDataArr.forEach(function (student) {
        if (student.attendance === "Present") presentCount++;
        else if (student.attendance === "Absent") absentCount++;
    });

    doc.text("Total Students: " + studentDataArr.length, 14, 32);
    doc.text("Total Present: " + presentCount, 14, 39);
    doc.text("Total Absent: " + absentCount, 14, 46);

    // -------- Table Data --------
    let tableData = [];

    studentDataArr.forEach((student, index) => {
        tableData.push([
            index + 1,
            student.name,
            student.number,
            student.city,
            student.rollNo,
            student.attendance || "Not Marked"
        ]);
    });

    doc.autoTable({
        head: [["#", "Name", "Number", "City", "Roll No", "Attendance"]],
        body: tableData,
        startY: 55,
        theme: "grid",
        styles: { halign: "center" },
        headStyles: { fillColor: [0, 128, 128] }
    });

    doc.save("Attendance_Report.pdf");
}

function markAllPresent() {

    if (studentDataArr.length === 0) {
        alert("No students available!");
        return;
    }

    studentDataArr.forEach(function (student) {
        student.attendance = "Present";
    });

    localStorage.setItem("studentData", JSON.stringify(studentDataArr));
    displayFun();
}