<?php

namespace App\Socket\Entity;

class Card
{
    private int $id;
    private string $value;
    private CardCategory $category;

    public function toArray(): array
    {
        return [
            'category' => $this->getCategory()->toArray(),
            'value' => $this->getValue(),
        ];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getCategory(): ?CardCategory
    {
        return $this->category;
    }

    public function setCategory(?CardCategory $category): self
    {
        $this->category = $category;

        return $this;
    }
}
