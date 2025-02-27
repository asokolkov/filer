import secrets


class File:
    def __init__(self, download_once: bool = True, save_for_n_weeks: int = None):
        self.uid = secrets.token_urlsafe(6)
        self.download_once = download_once
        self.save_for_n_weeks = save_for_n_weeks

    def json(self) -> dict:
        return vars(self)
