<?php
    // print_r($_POST);
    // print_r($_FILES);//文件保存在临时文件夹D:\my\xampp\package\tmp

    /*
    *   将获取的文件保存到新的路径以永久保存
    */
    //1. 获取上传文件对应的字典
    $fileInfo = $_FILES['upFile'];

    //2. 获取上传文件的名称
    $fileName = $fileInfo['name'];

    //3. 获取上传文件保存的临时路径
    $filePath = $fileInfo['tmp_name'];

    //4. 移动文件
    move_uploaded_file($filePath, '../source/'.$fileName);
    echo $fileName .' 上传成功！';
    
?>