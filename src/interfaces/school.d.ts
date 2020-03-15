export interface ISchoolFood {
    name: string,
    slug: string,
}

export interface ISchoolCourse extends ISchoolFood {
    calories: string
}

export interface ISchoolMeal {
    soup: ISchoolFood,
    mainCourse: ISchoolFood,
    vegetarien: ISchoolFood,
    complementary: ISchoolFood[],
    selectives: ISchoolFood[]
}
