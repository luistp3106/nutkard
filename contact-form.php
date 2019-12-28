<?php
 ini_set('display_errors', 1);

if(isset($_POST['submit'])){
    $nombre=$_POST['nombre'];
    $correo=$_POST['correo'];
    $mensaje=$_POST['mensaje'];

    $mailto="luistp3106@hotmail.com";
    $headers="Correo de Nutkard.com:".$correo;
    $txt="Has recibido un correo de  ".$nombre;".\n\n".$mensaje;
    mail($mailto,$headers,$txt);
    header("Location:contactos.php?emailsend");
}
if ($mail){
    echo "Done";
}
else{
    echo "Fail";
}
?>