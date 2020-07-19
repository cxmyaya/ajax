<?php
    $str = 'ww';
    $num = 10;
    echo $num;
    echo '<br>';

    //php 定义集合和字典（key => value）注意用‘ => ’
    //echo 不能输出集合

    //php 定义集合
    $arr = array(1,3,5);
    print_r($arr);
    echo '<br>';
    echo $arr[0];

    //php 定义字典
    $dict = array(
        'name' => 'xxx',
        'age' => '18'
    );
    echo '<br>';
    print_r ($dict);

    //php的分支循环跟 js 一样
    // if/switch/for/while/三目
    echo '<br>';
    //注意数组的长度不再用 length，用count()
    for($i = 0; $i < count($arr); $i++){
        echo $arr[$i];
        echo '<br>';
    }
?>