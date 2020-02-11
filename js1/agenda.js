
async function loadEvents(){
    let events = [];
    let r = await ajax2('POST', `${location.protocol}//${location.hostname}:3030/api/getCitas`, {token: sessionStorage.getItem('token')});
    let result = r.citas;
    if (compare(r.token)) sessionStorage.setItem('token', r.token);
    if (compare(result)){
        for(let i of result){
            let inicio = new Date(i.fecha_inicio);
            let fin = new Date(i.fecha_fin);
            inicio.setMinutes(inicio.getMinutes() - new Date().getTimezoneOffset());
            fin.setMinutes(fin.getMinutes() - new Date().getTimezoneOffset());
            events.push({
                start: inicio.toISOString(),
                end: fin.toISOString(),
                title: i.nombre_paciente,
                id: i.id,
            });
        }
    }
    $('#calendar').fullCalendar('removeEventSources');
    $('#calendar').fullCalendar('addEventSource', events);
}

async function confirmElimination(event){
    if (confirm('¿Está seguro que desea eliminar esta cita?')){
        let r = await ajax2('POST', `${location.protocol}//${location.hostname}:3030/api/deleteCita`, {id: event.id.toString(), token: sessionStorage.getItem('token')});
        if (!r.status) alert(r.message);
        else if (compare(r.token)) sessionStorage.setItem('token', r.token);
        await loadEvents();
    }
}

function closeSession(){
    sessionStorage.removeItem('token');
    location.href = "index.html";
}

setTimeout(function(){
    $('#calendar').fullCalendar({
        defaultView: 'month',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaDay,agendaWeek,month,listWeek'
        },
        navLinks: true,
        selectable: true,
        selectHelper: true,
        select: function() {
            $('#calendar').fullCalendar('unselect');
        },
        editable: true,
        eventLimit: true,
        events: [],
        height: 'auto',
        eventClick: confirmElimination,
        eventResize: loadEvents,
        eventDrop: loadEvents,
        width: '100%',
        slotDuration: '00:20:00',
        selection: false
    });
    loadEvents();
}, 500);