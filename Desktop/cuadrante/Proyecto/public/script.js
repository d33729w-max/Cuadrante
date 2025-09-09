// Importa las funciones que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCPMQBgYe3hsytMqyJ_T-wiYoSJTNtuwD0",
    authDomain: "cuadrante-64e6c.firebaseapp.com",
    projectId: "cuadrante-64e6c",
    storageBucket: "cuadrante-64e6c.firebasestorage.app",
    messagingSenderId: "457600146765",
    appId: "1:457600146765:web:70f7adcb513654cef7ab04"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Variables y constantes del DOM
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const logoutBtn2 = document.getElementById('logout-btn-2');
const authSection = document.getElementById('auth-section');
const adminSection = document.getElementById('admin-section');
const calendarSection = document.getElementById('calendar-section');
const onboardingModal = document.getElementById('onboarding-modal');
const createNewSquadBtn = document.getElementById('create-new-squad-btn');
const joinExistingSquadBtn = document.getElementById('join-existing-squad-btn');
const pendingModal = document.getElementById('pending-modal');
const squadNameInput = document.getElementById('squad-name-input');
const adminNameInput = document.getElementById('admin-name-input');
const createSquadBtn = document.getElementById('create-squad-btn');
const newMemberInput = document.getElementById('new-member-input');
const addMemberBtn = document.getElementById('add-member-btn');
const memberList = document.getElementById('member-list');
const pendingRequestsList = document.getElementById('pending-requests-list');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const currentMonthYearHeader = document.getElementById('current-month-year');
const calendarGrid = document.getElementById('calendar-grid');
const dayDetailsModal = document.getElementById('day-details-modal');
const dayDetailsTitle = document.getElementById('day-details-title');
const dayDetailsInfo = document.getElementById('day-details-info');
const closeDayDetailsModal = document.querySelector('#day-details-modal .close-button');
const singleDayModal = document.getElementById('single-day-modal');
const closeSingleDayModal = document.getElementById('close-single-day-modal');
const manageAbsencesBtn = document.getElementById('manage-absences-btn');
const saveModalBtn = document.getElementById('save-modal-btn');
const deleteModalBtn = document.getElementById('delete-modal-btn');
const personNameDaySelect = document.getElementById('person-name-day');
const absenceTypeDaySelect = document.getElementById('absence-type-day');
const startDateModal = document.getElementById('start-date-modal');
const endDateModal = document.getElementById('end-date-modal');
const authAlerts = document.getElementById('auth-alerts');
const modalAlerts = document.getElementById('modal-alerts');
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
const currentSquadId = localStorage.getItem('currentSquadId');
const currentUserId = localStorage.getItem('currentUserId');
const currentUserName = localStorage.getItem('currentUserName');
let isSquadAdmin = false;
const currentSquadName = localStorage.getItem('currentSquadName');
const currentSquadCadencia = localStorage.getItem('currentSquadCadencia');
const currentSquadStartDate = localStorage.getItem('currentSquadStartDate');
const appVersion = "0.0.1";
const appVersionDisplay = document.getElementById('app-version-display');
const appVersionDisplay2 = document.getElementById('app-version-display-2');
const currentUserDisplay = document.getElementById('current-user-display');
const currentUserDisplay2 = document.getElementById('current-user-display-2');
const cadenciaInput = document.getElementById('cadencia-input');
const startDateTurnos = document.getElementById('start-date-turnos');

// Variables globales para el calendario
let selectedMonth = new Date().getMonth();
let selectedYear = new Date().getFullYear();
let currentViewDate = new Date();

// Ocultar todas las secciones excepto la de autenticación al inicio
function hideAllSections() {
    authSection.classList.add('hidden');
    adminSection.classList.add('hidden');
    calendarSection.classList.add('hidden');
}

// Mostrar la sección de autenticación
function showAuthSection() {
    hideAllSections();
    authSection.classList.remove('hidden');
}

// Mostrar la sección de administrador o calendario
function showMainSection(user) {
    hideAllSections();
    if (user && isSquadAdmin) {
        adminSection.classList.remove('hidden');
    } else {
        calendarSection.classList.remove('hidden');
    }
}

// Manejar el inicio de sesión
googleLoginBtn.addEventListener('click', async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
        authAlerts.textContent = "Error al iniciar sesión. Inténtalo de nuevo.";
    }
});

// Manejar el cierre de sesión
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});

logoutBtn2.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});

// Comprobar el estado de autenticación
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Usuario autenticado:", user.uid, user.displayName);
        localStorage.setItem('currentUserId', user.uid);
        localStorage.setItem('currentUserName', user.displayName);
        currentUserDisplay.textContent = user.displayName;
        currentUserDisplay2.textContent = user.displayName;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("Datos del usuario existentes:", userData);

            if (userData.squadId) {
                localStorage.setItem('currentSquadId', userData.squadId);
                await checkUserRole(user.uid, userData.squadId);
                showMainSection(user);
            } else if (userData.pendingRequest) {
                showPendingModal();
            } else {
                showOnboardingModal();
            }
        } else {
            console.log("Nuevo usuario. Creando documento...");
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                squadId: null,
                role: 'user',
                pendingRequest: false
            });
            showOnboardingModal();
        }
    } else {
        console.log("Usuario no autenticado. Mostrando sección de autenticación.");
        localStorage.clear();
        showAuthSection();
    }
});

function showOnboardingModal() {
    hideAllSections();
    onboardingModal.classList.remove('hidden');
}

function showPendingModal() {
    hideAllSections();
    pendingModal.classList.remove('hidden');
}

async function checkUserRole(userId, squadId) {
    const squadRef = doc(db, "squads", squadId);
    const squadSnap = await getDoc(squadRef);

    if (squadSnap.exists()) {
        const squadData = squadSnap.data();
        localStorage.setItem('currentSquadName', squadData.name);
        localStorage.setItem('currentSquadCadencia', squadData.cadencia);
        localStorage.setItem('currentSquadStartDate', squadData.startDate);
        if (squadData.adminUid === userId) {
            isSquadAdmin = true;
            console.log("El usuario es administrador.");
        } else {
            isSquadAdmin = false;
            console.log("El usuario no es administrador.");
        }
    }
}

// Funciones para la gestión de cuadrantes (Crear, Unirse)
createNewSquadBtn.addEventListener('click', () => {
    onboardingModal.classList.add('hidden');
    adminSection.classList.remove('hidden');
});

joinExistingSquadBtn.addEventListener('click', async () => {
    const squadCode = prompt("Ingresa el código del cuadrante:");
    if (squadCode) {
        const squadRef = doc(db, "squads", squadCode);
        const squadSnap = await getDoc(squadRef);
        if (squadSnap.exists()) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, {
                pendingRequest: true
            });
            await updateDoc(squadRef, {
                pendingMembers: arrayUnion({ uid: auth.currentUser.uid, name: auth.currentUser.displayName })
            });
            alert("Solicitud enviada. Espera la aprobación del administrador.");
            window.location.reload();
        } else {
            alert("Código de cuadrante no válido.");
        }
    }
});

createSquadBtn.addEventListener('click', async () => {
    const squadName = squadNameInput.value.trim();
    const adminName = adminNameInput.value.trim();
    const cadencia = cadenciaInput.value.trim();
    const startDate = startDateTurnos.value;

    if (squadName && adminName && cadencia && startDate) {
        try {
            const newSquadRef = doc(collection(db, "squads"));
            await setDoc(newSquadRef, {
                id: newSquadRef.id,
                name: squadName,
                cadencia: cadencia,
                startDate: startDate,
                adminUid: auth.currentUser.uid,
                adminName: adminName,
                members: [{ uid: auth.currentUser.uid, name: adminName }],
                pendingMembers: []
            });

            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, {
                squadId: newSquadRef.id,
                role: 'admin'
            });

            localStorage.setItem('currentSquadId', newSquadRef.id);
            localStorage.setItem('currentSquadName', squadName);
            localStorage.setItem('currentSquadCadencia', cadencia);
            localStorage.setItem('currentSquadStartDate', startDate);
            isSquadAdmin = true;

            alert("¡Cuadrante creado con éxito!");
            window.location.reload();

        } catch (error) {
            console.error("Error al crear el cuadrante:", error);
            alert("Error al crear el cuadrante. Inténtalo de nuevo.");
        }
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Gestión de Miembros y Solicitudes
if (addMemberBtn) {
    addMemberBtn.addEventListener('click', async () => {
        const newMemberName = newMemberInput.value.trim();
        if (newMemberName) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists() && userSnap.data().squadId) {
                const squadRef = doc(db, "squads", userSnap.data().squadId);
                await updateDoc(squadRef, {
                    members: arrayUnion({ uid: 'manual-' + Date.now(), name: newMemberName })
                });
                newMemberInput.value = '';
            }
        }
    });
}

// Sincronizar UI con la base de datos en tiempo real
onSnapshot(doc(db, "squads", currentSquadId), (docSnap) => {
    if (docSnap.exists()) {
        const squadData = docSnap.data();
        if (memberList) {
            memberList.innerHTML = '';
            squadData.members.forEach(member => {
                const li = document.createElement('li');
                li.textContent = member.name;
                memberList.appendChild(li);
            });
        }
        if (pendingRequestsList && squadData.pendingMembers && isSquadAdmin) {
            pendingRequestsList.innerHTML = '';
            squadData.pendingMembers.forEach(member => {
                const li = document.createElement('li');
                li.textContent = member.name;
                const approveBtn = document.createElement('button');
                approveBtn.textContent = 'Aprobar';
                approveBtn.addEventListener('click', async () => {
                    const memberRef = doc(db, "users", member.uid);
                    await updateDoc(memberRef, {
                        squadId: currentSquadId,
                        pendingRequest: false
                    });
                    await updateDoc(doc(db, "squads", currentSquadId), {
                        members: arrayUnion({ uid: member.uid, name: member.name }),
                        pendingMembers: arrayRemove({ uid: member.uid, name: member.name })
                    });
                });
                li.appendChild(approveBtn);
                pendingRequestsList.appendChild(li);
            });
        }
    }
});

// Lógica del Calendario
if (calendarGrid) {
    function generateCalendar(month, year) {
        calendarGrid.innerHTML = '';
        currentMonthYearHeader.textContent = `${getMonthName(month)} ${year}`;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();
        const dates = [];

        // Días del mes anterior para rellenar
        const prevMonthLastDay = new Date(year, month, 0);
        const prevDaysInMonth = prevMonthLastDay.getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            dates.push({ day: prevDaysInMonth - i, type: 'other-month' });
        }

        // Días del mes actual
        for (let i = 1; i <= daysInMonth; i++) {
            dates.push({ day: i, type: 'current-month', date: new Date(year, month, i) });
        }

        // Días del mes siguiente para rellenar
        let nextDay = 1;
        while (dates.length % 7 !== 0) {
            dates.push({ day: nextDay, type: 'other-month' });
            nextDay++;
        }

        dates.forEach((dateInfo, index) => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = dateInfo.day;
            if (dateInfo.type === 'other-month') {
                dayElement.classList.add('other-month-day');
            } else {
                dayElement.addEventListener('click', () => showDayDetails(dateInfo.date));
            }
            // Lógica de turnos y ausencias
            if (dateInfo.type === 'current-month' && currentSquadCadencia) {
                const turnos = currentSquadCadencia.split(',');
                const startDateParts = currentSquadStartDate.split('-');
                const startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2]);
                const diffTime = dateInfo.date.getTime() - startDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 0) {
                    const turnoIndex = diffDays % turnos.length;
                    const turno = turnos[turnoIndex];
                    const turnoSpan = document.createElement('span');
                    turnoSpan.classList.add('turno');
                    turnoSpan.textContent = turno;
                    dayElement.appendChild(turnoSpan);
                }
            }
            calendarGrid.appendChild(dayElement);
        });
        
        getAbsences(month, year);
    }

    function getMonthName(month) {
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return monthNames[month];
    }

    function showDayDetails(date) {
        dayDetailsTitle.textContent = date.toLocaleDateString();
        dayDetailsInfo.innerHTML = '';
        dayDetailsModal.classList.remove('hidden');
    }

    function updateCalendarNav() {
        currentMonthYearHeader.textContent = `${getMonthName(selectedMonth)} ${selectedYear}`;
    }

    prevMonthBtn.addEventListener('click', () => {
        selectedMonth--;
        if (selectedMonth < 0) {
            selectedMonth = 11;
            selectedYear--;
        }
        generateCalendar(selectedMonth, selectedYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        selectedMonth++;
        if (selectedMonth > 11) {
            selectedMonth = 0;
            selectedYear++;
        }
        generateCalendar(selectedMonth, selectedYear);
    });

    // Lógica para ausencias
    async function getAbsences(month, year) {
        if (!currentSquadId) return;
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);
        const absencesRef = collection(db, "squads", currentSquadId, "absences");
        const q = query(absencesRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const absenceData = doc.data();
            const absenceDate = absenceData.date.toDate();
            const dayElement = document.querySelector(`.day:not(.other-month-day)`);
            if (dayElement && absenceDate.getDate() === parseInt(dayElement.textContent)) {
                dayElement.classList.add('has-absence');
            }
        });
    }

    manageAbsencesBtn.addEventListener('click', () => {
        dayDetailsModal.classList.add('hidden');
        singleDayModal.classList.remove('hidden');
    });

    closeSingleDayModal.addEventListener('click', () => {
        singleDayModal.classList.add('hidden');
    });

    saveModalBtn.addEventListener('click', async () => {
        const personName = personNameDaySelect.value;
        const absenceType = absenceTypeDaySelect.value;
        const startDate = new Date(startDateModal.value);
        const endDate = new Date(endDateModal.value);

        if (!personName || !absenceType || !startDateModal.value || !endDateModal.value) {
            modalAlerts.textContent = "Por favor, rellena todos los campos.";
            return;
        }

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            try {
                await setDoc(doc(db, "squads", currentSquadId, "absences", currentDate.toISOString().split('T')[0]), {
                    date: currentDate,
                    person: personName,
                    type: absenceType
                });
                currentDate.setDate(currentDate.getDate() + 1);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        modalAlerts.textContent = "Ausencia(s) guardada(s) con éxito.";
        generateCalendar(selectedMonth, selectedYear);
        setTimeout(() => {
            singleDayModal.classList.add('hidden');
        }, 1500);
    });

    deleteModalBtn.addEventListener('click', async () => {
        const personName = personNameDaySelect.value;
        const startDate = new Date(startDateModal.value);
        const endDate = new Date(endDateModal.value);

        if (!personName || !startDateModal.value || !endDateModal.value) {
            modalAlerts.textContent = "Por favor, rellena todos los campos.";
            return;
        }

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            try {
                await deleteDoc(doc(db, "squads", currentSquadId, "absences", currentDate.toISOString().split('T')[0]));
                currentDate.setDate(currentDate.getDate() + 1);
            } catch (e) {
                console.error("Error removing document: ", e);
            }
        }
        modalAlerts.textContent = "Ausencia(s) eliminada(s) con éxito.";
        generateCalendar(selectedMonth, selectedYear);
        setTimeout(() => {
            singleDayModal.classList.add('hidden');
        }, 1500);
    });

    // Llenar el selector de personas
    if (personNameDaySelect) {
        const squadRef = doc(db, "squads", currentSquadId);
        onSnapshot(squadRef, (docSnap) => {
            if (docSnap.exists()) {
                const squadData = docSnap.data();
                personNameDaySelect.innerHTML = '';
                squadData.members.forEach(member => {
                    const option = document.createElement('option');
                    option.value = member.name;
                    option.textContent = member.name;
                    personNameDaySelect.appendChild(option);
                });
            }
        });
    }

    // Inicializar el calendario si el usuario ya está en un escuadrón
    if (currentSquadId) {
        generateCalendar(selectedMonth, selectedYear);
    }
}