<?php
 ini_set('display_errors', 1);

if(isset($_POST['submit'])){
    $name=$_POST['name'];
    $email=$_POST['email'];
    $message=$_POST['message'];

    $mailto="luistp3106@hotmail.com";
    $headers="Correo de Nutkard.com:".$email;
    $txt="Has recibido un correo de".$name;".\n\n".$message;
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