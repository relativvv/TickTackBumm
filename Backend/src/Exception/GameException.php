<?php

namespace App\Exception;

use JetBrains\PhpStorm\Pure;
use Symfony\Component\Config\Definition\Exception\Exception;
use Throwable;

class GameException extends Exception {

    #[Pure] public function __construct($message = "", $code = -1, Throwable $previous = null) {
        parent::__construct($message, $code, $previous);
    }
}