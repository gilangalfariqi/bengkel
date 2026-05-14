<?php

namespace App\Contracts;

interface MidtransClientInterface
{
    /**
     * Get a snap token for given params
     *
     * @param array $params
     * @return string
     */
    public function getSnapToken(array $params): string;
}
