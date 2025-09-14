export function GetRandomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const CalculateLv = (lvWeigth: number) => {
  const weigthArray = [41.39, 26.7, 15.9, 8.6, 5.8, 1.5, 0.1, 0.01];
  if (lvWeigth <= weigthArray[0] * 100000) {
    return GetRandomInRange(1, 1000); // E: 1 - 1000 (41.39%)
  } else if (lvWeigth <= weigthArray[1] * 100000) {
    return GetRandomInRange(1001, 99999); // D: 10k - 99k (26.7%)
  } else if (lvWeigth <= weigthArray[2] * 100000) {
    return GetRandomInRange(100000, 499999); // C: 100k - 499k (15.9%)
  } else if (lvWeigth <= weigthArray[3] * 100000) {
    return GetRandomInRange(500000, 999999); // B: 500k - 999k (8.6%)
  } else if (lvWeigth <= weigthArray[4] * 100000) {
    return GetRandomInRange(1000000, 4999999); // A: 1M - 4.9M (5.8%)
  } else if (lvWeigth <= weigthArray[5] * 100000) {
    return GetRandomInRange(5000000, 19999999); // S: 5M - 19.9M (1.5%)
  } else if (lvWeigth <= weigthArray[6] * 100000) {
    return GetRandomInRange(20000000, 44999999); // S+: 20M - 44.9M (0.1%)
  } else if (lvWeigth <= weigthArray[7] * 100000) {
    return GetRandomInRange(45000000, 50000000); // SSS: 45M - 50M (0.01%)
  }
  return 0;
};

export const CalculatePower = (equipment: any) => {
  if (!equipment) {
    return -1;
  }
  let atk = 0,
    def = 0,
    hp = 0,
    luck = 0;
  Object.keys(equipment).forEach((element: any) => {
    atk += equipment[element]?.atk ?? 0;
    def += equipment[element]?.def ?? 0;
    hp += equipment[element]?.hp ?? 0;
    luck += equipment[element]?.luck ?? 0;
  });

  return atk * 2 + def + hp + luck * atk;
};

export const CalculateItemProp = (equipment: any, prop: 'atk' | 'def' | 'hp' | 'luck') => {
  if (!equipment) {
    return -1;
  }
  let value = 0;
  Object.keys(equipment).forEach((element: any) => {
    value += equipment[element]?.[prop] ?? 0;
  });

  return value ?? 0;
};
