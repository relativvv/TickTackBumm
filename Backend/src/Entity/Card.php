<?php

namespace App\Entity;

use App\Repository\CardRepository;
use Doctrine\ORM\Mapping as ORM;

const CATEGORY_KNOWN = "known";
const CATEGORY_ASKED = "asked";
const CATEGORY_SETTED = "setted";
const CATEGORY_SHAKED = "shaked";
const CATEGORY_ORIGINAL = "original";
const CATEGORY_JOKER = "joker";

#[ORM\Entity(repositoryClass: CardRepository::class)]
class Card
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string', length: 255)]
    private string $value;

    #[ORM\ManyToOne(targetEntity: CardCategory::class)]
    #[ORM\JoinColumn(nullable: false)]
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
