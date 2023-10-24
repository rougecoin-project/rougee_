<?php

// global functions 
function carray($var){

	return (is_array($var) or ($var instanceof Traversable));

	
}


function unichar2ords($char, $encoding = 'UTF-8') {       
    $char = mb_convert_encoding($char, 'UCS-4', $encoding);
    $val = unpack('N', $char);           
    return $val[1];
    }

function ords2unichar($ords, $encoding = 'UTF-8'){
    $char = pack('N', $ords);
    return mb_convert_encoding($char, $encoding, 'UCS-4');           
    }

function mbStringToArray ($string, $encoding = 'UTF-8') {
    if (empty($string)) return false;
    for ($strlen = mb_strlen($string, $encoding); $strlen > 0; ) {
        $array[] = mb_substr($string, 0, 1, $encoding);
        $string  = mb_substr($string, 1, $strlen, $encoding);
        $strlen  = $strlen - 1;
        }
    return $array;
    }

function unicodeRotN($str, $offset, $encoding = 'UTF-8') {
    $val = '';
    $array = mbStringToArray ($str, $encoding = 'UTF-8');
    $len = count($array);
    for ($i = 0; $i < $len; $i++) {
        $val .= ords2unichar(unichar2ords($array[$i], $encoding) + $offset, $encoding);
        }
    return $val;
    }
